const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToMove = [
  // Dashboard components
  {
    oldPath: 'components/layout/Header.js',
    newPath: 'app/dashboard/_components/Header.js',
    oldImport: '@/components/layout/Header',
    newImport: '@/app/dashboard/_components/Header'
  },
  {
    oldPath: 'components/layout/Sidebar.js',
    newPath: 'app/dashboard/_components/Sidebar.js',
    oldImport: '@/components/layout/Sidebar',
    newImport: '@/app/dashboard/_components/Sidebar'
  },
  {
    oldPath: 'components/charts/RevenueChart.js',
    newPath: 'app/dashboard/_components/RevenueChart.js',
    oldImport: '@/components/charts/RevenueChart',
    newImport: '@/app/dashboard/_components/RevenueChart'
  },
  {
    oldPath: 'components/charts/UsersBarChart.js',
    newPath: 'app/dashboard/_components/UsersBarChart.js',
    oldImport: '@/components/charts/UsersBarChart',
    newImport: '@/app/dashboard/_components/UsersBarChart'
  },
  // User components
  {
    oldPath: 'components/forms/AddUserDialog.js',
    newPath: 'app/dashboard/users/_components/AddUserDialog.js',
    oldImport: '@/components/forms/AddUserDialog',
    newImport: '@/app/dashboard/users/_components/AddUserDialog'
  },
  {
    oldPath: 'components/table/UsersColumns.js',
    newPath: 'app/dashboard/users/_components/UsersColumns.js',
    oldImport: '@/components/table/UsersColumns',
    newImport: '@/app/dashboard/users/_components/UsersColumns'
  },
  {
    oldPath: 'features/users/users.service.js',
    newPath: 'app/dashboard/users/_services/users.service.js',
    oldImport: '@/features/users/users.service',
    newImport: '@/app/dashboard/users/_services/users.service'
  }
];

// Helper to create directories recursively
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Move files
filesToMove.forEach(({ oldPath, newPath }) => {
  const fullOldPath = path.join(srcDir, oldPath);
  const fullNewPath = path.join(srcDir, newPath);
  
  if (fs.existsSync(fullOldPath)) {
    ensureDirSync(path.dirname(fullNewPath));
    fs.renameSync(fullOldPath, fullNewPath);
    console.log(`Moved ${oldPath} to ${newPath}`);
  } else {
    console.warn(`File not found: ${fullOldPath}`);
  }
});

// Update imports
function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx') || dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
}

const allJsFiles = walkSync(srcDir);

allJsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  filesToMove.forEach(({ oldImport, newImport }) => {
    // Replace all occurrences of the old import with the new import
    const regex = new RegExp(oldImport.replace(/\//g, '\\/'), 'g');
    content = content.replace(regex, newImport);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${file.replace(srcDir, '')}`);
  }
});

console.log('Refactoring complete.');
