// Mock for @tauri-apps/api/core

export async function invoke(cmd: string, args?: any): Promise<any> {
  switch (cmd) {
    case 'READ_DIRECTORY':
      // Return a mock directory listing
      return [
        {
          name: 'file1.txt',
          path: '/mock/path/file1.txt',
          is_dir: false,
          size: 1234,
          modified: 1713775552,
          file_type: 'file',
        },
        {
          name: 'subdir',
          path: '/mock/path/subdir',
          is_dir: true,
          file_type: 'dir',
        },
      ];
    case 'CREATE_DIR':
    case 'REMOVE_FILE_OR_DIRECTORY':
    case 'RENAME_FILE_OR_DIRECTORY':
      // Simulate successful operation
      return;
    default:
      throw new Error(`Unmocked invoke command: ${cmd}`);
  }
}
