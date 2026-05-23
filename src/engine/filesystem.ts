import { FsNode, FsSnapshot, FsSnapshotEntry, VirtualFS } from '../types/index.js';

function createNode(
  name: string,
  type: 'file' | 'directory',
  parent: FsNode | null,
  content = '',
  permissions = type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--',
): FsNode {
  return {
    name,
    type,
    permissions,
    content,
    children: new Map(),
    parent,
    modifiedAt: new Date(),
    createdAt: new Date(),
  };
}

export function createRoot(): VirtualFS {
  const root = createNode('/', 'directory', null);
  const home = createNode('home', 'directory', root);
  const user = createNode('user', 'directory', home);
  const tmp = createNode('tmp', 'directory', root);
  const etc = createNode('etc', 'directory', root);

  // Populate /home/user with default files
  const docs = createNode('Documents', 'directory', user);
  const report = createNode('report.txt', 'file', docs, 'Annual Report 2024\nQuarterly summary here.');
  docs.children.set('report.txt', report);

  const downloads = createNode('Downloads', 'directory', user);

  const notes = createNode('notes.txt', 'file', user, 'Remember to buy milk\nCall mom\nFinish project');
  const bashrc = createNode('.bashrc', 'file', user, 'export PATH=$PATH:/usr/local/bin');
  const hidden = createNode('.hidden', 'file', user, 'secret data');

  user.children.set('Documents', docs);
  user.children.set('Downloads', downloads);
  user.children.set('notes.txt', notes);
  user.children.set('.bashrc', bashrc);
  user.children.set('.hidden', hidden);

  // Populate /etc
  const config = createNode('config.json', 'file', etc, '{"name":"learn-linux","version":"1.0"}');
  etc.children.set('config.json', config);

  home.children.set('user', user);
  root.children.set('home', home);
  root.children.set('tmp', tmp);
  root.children.set('etc', etc);

  return { root, cwd: user };
}

export function getPath(fs: VirtualFS): string {
  const parts: string[] = [];
  let node: FsNode | null = fs.cwd;
  while (node && node.parent) {
    parts.unshift(node.name);
    node = node.parent;
  }
  return '/' + parts.join('/');
}

export function resolvePath(fs: VirtualFS, inputPath: string): FsNode | null {
  if (!inputPath) return fs.cwd;

  let current: FsNode;
  const parts = inputPath.split('/').filter(Boolean);

  if (inputPath.startsWith('/')) {
    current = fs.root;
  } else {
    current = fs.cwd;
  }

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (current.parent) current = current.parent;
      continue;
    }
    const child = current.children.get(part);
    if (!child) return null;
    current = child;
  }

  return current;
}

export function resolveParent(fs: VirtualFS, inputPath: string): { parent: FsNode | null; name: string } {
  const parts = inputPath.split('/').filter(Boolean);
  if (parts.length === 0) return { parent: null, name: '' };

  const childName = parts.pop()!;
  const parentPath = inputPath.startsWith('/') ? '/' + parts.join('/') : parts.join('/');
  const parent = parts.length === 0
    ? (inputPath.startsWith('/') ? fs.root : fs.cwd)
    : resolvePath(fs, parentPath);

  return { parent, name: childName };
}

export function mkdir(fs: VirtualFS, inputPath: string, recursive = false): { fs: VirtualFS; stderr: string; exitCode: number } {
  if (recursive) {
    const parts = inputPath.split('/').filter(Boolean);
    let current: FsNode = inputPath.startsWith('/') ? fs.root : fs.cwd;

    for (const part of parts) {
      const child = current.children.get(part);
      if (child) {
        if (child.type !== 'directory') {
          return { fs, stderr: `mkdir: ${inputPath}: Not a directory`, exitCode: 1 };
        }
        current = child;
      } else {
        const newDir = createNode(part, 'directory', current);
        current.children.set(part, newDir);
        current = newDir;
      }
    }
    return { fs, stderr: '', exitCode: 0 };
  }

  const { parent, name } = resolveParent(fs, inputPath);
  if (!parent) return { fs, stderr: `mkdir: cannot create directory '${inputPath}': No such file or directory`, exitCode: 1 };
  if (parent.children.has(name)) return { fs, stderr: `mkdir: cannot create directory '${name}': File exists`, exitCode: 1 };

  const newDir = createNode(name, 'directory', parent);
  parent.children.set(name, newDir);
  return { fs, stderr: '', exitCode: 0 };
}

export function rmdir(fs: VirtualFS, inputPath: string): { fs: VirtualFS; stderr: string; exitCode: number } {
  const node = resolvePath(fs, inputPath);
  if (!node) return { fs, stderr: `rmdir: failed to remove '${inputPath}': No such file or directory`, exitCode: 1 };
  if (node.type !== 'directory') return { fs, stderr: `rmdir: failed to remove '${inputPath}': Not a directory`, exitCode: 1 };
  if (node.children.size > 0) return { fs, stderr: `rmdir: failed to remove '${inputPath}': Directory not empty`, exitCode: 1 };

  if (node.parent) node.parent.children.delete(node.name);
  return { fs, stderr: '', exitCode: 0 };
}

export function touch(fs: VirtualFS, inputPath: string): { fs: VirtualFS; stderr: string; exitCode: number } {
  const existing = resolvePath(fs, inputPath);
  if (existing) {
    existing.modifiedAt = new Date();
    return { fs, stderr: '', exitCode: 0 };
  }

  const { parent, name } = resolveParent(fs, inputPath);
  if (!parent) return { fs, stderr: `touch: cannot touch '${inputPath}': No such file or directory`, exitCode: 1 };

  const newFile = createNode(name, 'file', parent);
  parent.children.set(name, newFile);
  return { fs, stderr: '', exitCode: 0 };
}

export function rm(fs: VirtualFS, inputPath: string, recursive = false, force = false): { fs: VirtualFS; stderr: string; exitCode: number } {
  const node = resolvePath(fs, inputPath);
  if (!node) {
    return force
      ? { fs, stderr: '', exitCode: 0 }
      : { fs, stderr: `rm: cannot remove '${inputPath}': No such file or directory`, exitCode: 1 };
  }
  if (node.type === 'directory' && !recursive) {
    return { fs, stderr: `rm: cannot remove '${inputPath}': Is a directory`, exitCode: 1 };
  }
  if (node.parent) node.parent.children.delete(node.name);
  return { fs, stderr: '', exitCode: 0 };
}

export function cp(fs: VirtualFS, srcPath: string, destPath: string, recursive = false): { fs: VirtualFS; stderr: string; exitCode: number } {
  const src = resolvePath(fs, srcPath);
  if (!src) return { fs, stderr: `cp: cannot stat '${srcPath}': No such file or directory`, exitCode: 1 };

  const dest = resolvePath(fs, destPath);

  if (src.type === 'directory' && !recursive) {
    return { fs, stderr: `cp: -r not specified; omitting directory '${srcPath}'`, exitCode: 1 };
  }

  if (dest && dest.type === 'directory') {
    const copy = cloneNode(src, dest);
    dest.children.set(src.name, copy);
    return { fs, stderr: '', exitCode: 0 };
  }

  const { parent, name } = resolveParent(fs, destPath);
  if (!parent) return { fs, stderr: `cp: cannot create regular file '${destPath}': No such file or directory`, exitCode: 1 };

  const copy = cloneNode(src, parent);
  copy.name = dest ? dest.name : name;
  parent.children.set(copy.name, copy);
  return { fs, stderr: '', exitCode: 0 };
}

export function mv(fs: VirtualFS, srcPath: string, destPath: string): { fs: VirtualFS; stderr: string; exitCode: number } {
  const src = resolvePath(fs, srcPath);
  if (!src) return { fs, stderr: `mv: cannot stat '${srcPath}': No such file or directory`, exitCode: 1 };

  const dest = resolvePath(fs, destPath);

  if (dest && dest.type === 'directory') {
    if (src.parent) src.parent.children.delete(src.name);
    src.parent = dest;
    dest.children.set(src.name, src);
    return { fs, stderr: '', exitCode: 0 };
  }

  if (src.parent) src.parent.children.delete(src.name);
  const { parent, name } = resolveParent(fs, destPath);
  if (!parent) return { fs, stderr: `mv: cannot move '${srcPath}' to '${destPath}'`, exitCode: 1 };

  src.name = dest ? dest.name : name;
  src.parent = parent;
  parent.children.set(src.name, src);
  return { fs, stderr: '', exitCode: 0 };
}

export function readFile(fs: VirtualFS, inputPath: string): { stdout: string; stderr: string; exitCode: number } {
  const node = resolvePath(fs, inputPath);
  if (!node) return { stdout: '', stderr: `cat: ${inputPath}: No such file or directory`, exitCode: 1 };
  if (node.type === 'directory') return { stdout: '', stderr: `cat: ${inputPath}: Is a directory`, exitCode: 1 };
  return { stdout: node.content, stderr: '', exitCode: 0 };
}

export function writeFile(fs: VirtualFS, inputPath: string, content: string, append = false): { fs: VirtualFS; stderr: string; exitCode: number } {
  const existing = resolvePath(fs, inputPath);
  if (existing && existing.type === 'file') {
    existing.content = append ? existing.content + content : content;
    existing.modifiedAt = new Date();
    return { fs, stderr: '', exitCode: 0 };
  }

  const { parent, name } = resolveParent(fs, inputPath);
  if (!parent) return { fs, stderr: `cannot write to '${inputPath}': No such file or directory`, exitCode: 1 };

  const newFile = createNode(name, 'file', parent, content);
  parent.children.set(name, newFile);
  return { fs, stderr: '', exitCode: 0 };
}

export function listDir(
  fs: VirtualFS,
  inputPath: string | null,
  showAll = false,
  longFormat = false,
): { stdout: string; stderr: string; exitCode: number } {
  const target = inputPath ? resolvePath(fs, inputPath) : fs.cwd;
  if (!target && inputPath) return { stdout: '', stderr: `ls: cannot access '${inputPath}': No such file or directory`, exitCode: 1 };
  if (!target) return { stdout: '', stderr: '', exitCode: 0 };
  if (target.type === 'file') return { stdout: target.name, stderr: '', exitCode: 0 };

  let entries = Array.from(target.children.values());

  if (!showAll) {
    entries = entries.filter(e => !e.name.startsWith('.'));
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  if (showAll) {
    // Add . and .. for display
    const dotDot = { name: '..', type: 'directory' as const };
    const dot = { name: '.', type: 'directory' as const };
    entries = [dot, dotDot, ...entries] as FsNode[];
  }

  if (longFormat) {
    const lines = entries.map(e => {
      const perm = e.type === 'directory' ? 'd' : '-';
      const lines = formatLongLine(perm + e.permissions, e);
      return lines;
    });
    return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
  }

  const names = entries.map(e => e.type === 'directory' ? e.name + '/' : e.name);
  return { stdout: names.join('  '), stderr: '', exitCode: 0 };
}

function formatLongLine(permStr: string, node: FsNode): string {
  const size = node.type === 'file' ? node.content.length : 4096;
  const date = node.modifiedAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  return `${permStr}  1 user  user  ${String(size).padStart(5)}  ${date}  ${node.name}`;
}

export function cd(fs: VirtualFS, inputPath: string): { fs: VirtualFS; stderr: string; exitCode: number } {
  if (!inputPath || inputPath === '~') {
    const home = resolvePath(fs, '/home/user');
    if (home) return { fs: { ...fs, cwd: home }, stderr: '', exitCode: 0 };
    return { fs, stderr: 'cd: no home directory', exitCode: 1 };
  }

  const target = resolvePath(fs, inputPath);
  if (!target) return { fs, stderr: `cd: ${inputPath}: No such file or directory`, exitCode: 1 };
  if (target.type !== 'directory') return { fs, stderr: `cd: ${inputPath}: Not a directory`, exitCode: 1 };

  return { fs: { ...fs, cwd: target }, stderr: '', exitCode: 0 };
}

export function pwd(fs: VirtualFS): string {
  return getPath(fs);
}

export function find(
  fs: VirtualFS,
  startPath: string,
  namePattern?: string,
  typeFilter?: 'file' | 'directory',
): string[] {
  const startNode = resolvePath(fs, startPath) ?? fs.cwd;
  const results: string[] = [];

  function walk(node: FsNode, path: string) {
    const matchesName = !namePattern || node.name === namePattern;
    const matchesType = !typeFilter || node.type === typeFilter;
    if (matchesName && matchesType && node !== startNode) {
      results.push(path);
    }
    if (node.type === 'directory') {
      for (const child of node.children.values()) {
        walk(child, path + '/' + child.name);
      }
    }
  }

  walk(startNode, startPath === '.' ? '.' : startPath);
  return results;
}

export function chmod(fs: VirtualFS, inputPath: string, mode: string): { fs: VirtualFS; stderr: string; exitCode: number } {
  const node = resolvePath(fs, inputPath);
  if (!node) return { fs, stderr: `chmod: cannot access '${inputPath}': No such file or directory`, exitCode: 1 };

  if (mode.startsWith('+') || mode.startsWith('-')) {
    const op = mode[0];
    const perm = mode.slice(1);
    let current = node.permissions.split('').map(c => c !== '-');
    // simplified: +x adds execute, +r adds read, +w adds write to all positions
    const permMap: Record<string, number[]> = {
      x: [2, 5, 8], r: [0, 3, 6], w: [1, 4, 7],
    };
    for (const p of perm.split('')) {
      const positions = permMap[p];
      if (positions) {
        for (const pos of positions) {
          current[pos] = op === '+';
        }
      }
    }
    node.permissions = current.map(v => {
      // reconstruct rwx-style from boolean array
      return v ? 'x' : '-';
    }).join('').replace(/(.{3})/g, (_, three) => {
      return (three[0] === '-' ? '-' : 'r') + (three[1] === '-' ? '-' : 'w') + (three[2] === '-' ? '-' : 'x');
    });
  } else if (/^[0-7]{3}$/.test(mode)) {
    node.permissions = octalToRwx(mode);
  }

  return { fs, stderr: '', exitCode: 0 };
}

function octalToRwx(octal: string): string {
  const map: Record<string, string> = {
    '0': '---', '1': '--x', '2': '-w-', '3': '-wx',
    '4': 'r--', '5': 'r-x', '6': 'rw-', '7': 'rwx',
  };
  return octal.split('').map(c => map[c] || '---').join('');
}

function cloneNode(node: FsNode, newParent: FsNode | null): FsNode {
  const clone = createNode(node.name, node.type, newParent, node.content, node.permissions);
  for (const [key, child] of node.children) {
    const childClone = cloneNode(child, clone);
    clone.children.set(key, childClone);
  }
  return clone;
}

export function deepClone(fs: VirtualFS): VirtualFS {
  const root = cloneNode(fs.root, null);
  const cwdPath = getPath(fs);
  let cwd = root;
  const parts = cwdPath.split('/').filter(Boolean);
  for (const part of parts) {
    const child = cwd.children.get(part);
    if (child) cwd = child;
  }
  return { root, cwd };
}

export function initFromSnapshot(snapshot: FsSnapshot): VirtualFS {
  const root = createNode('/', 'directory', null);

  function buildEntries(parent: FsNode, entries: FsSnapshot) {
    for (const [name, value] of Object.entries(entries)) {
      if (typeof value === 'string') {
        const file = createNode(name, 'file', parent, value);
        parent.children.set(name, file);
      } else {
        const dir = createNode(name, 'directory', parent);
        parent.children.set(name, dir);
        buildEntries(dir, value);
      }
    }
  }

  buildEntries(root, snapshot);
  return { root, cwd: root };
}
