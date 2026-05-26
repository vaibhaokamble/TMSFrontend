# Quick Reference Guide

## 🚀 Getting Started

### Start Development Server

```bash
npm run dev
```

App runs at: `http://localhost:5177`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm preview
```

---

## 📁 Project Structure Quick Guide

### Contexts (State Management)

```javascript
// Import contexts in any component:
import { useUser } from '../contexts/UserContext';
import { useTeam } from '../contexts/TeamContext';
import { useTask } from '../contexts/TaskContext';
```

### Components

```text
compoents/
├── Header.jsx        // Top navigation
├── Sidebar.jsx       // Left navigation
├── Layout.jsx        // Main layout wrapper
├── StatusBadge.jsx   // Status display
├── PriorityBadge.jsx // Priority display
└── UserAvatar.jsx    // User avatar display
```

### Pages

```text
pages/
├── Dashboard.jsx     // Home page with stats
├── Teams.jsx         // Team management
├── TaskBoard.jsx     // Main Kanban board
├── TaskModal.jsx     // Task details modal
├── TaskForm.jsx      // Create task form
└── Analytics.jsx     // Analytics page
```

---

## 🎨 Tailwind CSS Classes Cheat Sheet

### Colors (from tailwind.config.js)

```css
/* Primary Colors */
primary-50 through primary-900

/* Status Colors */
success    /* #10b981 */
warning    /* #f59e0b */
danger     /* #ef4444 */
pending    /* #6b7280 */

/* Dark Mode */
dark-50 through dark-900
```

### Responsive Prefixes

```css
/* Mobile first approach */
base-styles       /* applies to all screens */
sm:styles         /* 640px and up */
md:styles         /* 768px and up */
lg:styles         /* 1024px and up */
xl:styles         /* 1280px and up */
```

### Common Patterns

```jsx
// Container
<div className="max-w-2xl w-full mx-auto"> ... </div>

// Card
<div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">

// Button
<button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium">

// Input
<input className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />

// Badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
  Badge</span>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> ... </div>
```

---

## 💼 Context Usage Examples

### Using UserContext

```javascript
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { currentUser, login, logout, updateUser } = useUser();
  
  return <p>{currentUser?.name}</p>;
}
```

### Using TeamContext

```javascript
import { useTeam } from '../contexts/TeamContext';

function MyComponent() {
  const { 
    teams, 
    selectedTeamId, 
    setSelectedTeamId,
    getSelectedTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember
  } = useTeam();
  
  return <p>{getSelectedTeam()?.name}</p>;
}
```

### Using TaskContext

```javascript
import { useTask } from '../contexts/TaskContext';

function MyComponent() {
  const { 
    tasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByTeam,
    getTasksByStatus,
    addComment
  } = useTask();
  
  return <div>{tasks.length} tasks</div>;
}
```

---

## 🔧 Common Tasks

### Add a New Page

1. Create new component in `src/pages/NewPage.jsx`
2. Export component
3. Import in `App.jsx`
4. Add tab to sidebar navigation
5. Add conditional render in `AppContent`

### Add a New Component

1. Create component in `src/compoents/`
2. Use Tailwind for styling
3. Accept props for customization
4. Export as default

### Connect to Real API

Update TaskContext methods:

```javascript
// Old: Mock data
const createTask = (taskData) => {
  const newTask = { id: `task-${Date.now()}`, ...taskData };
  setTasks([...tasks, newTask]);
};

// New: API call
const createTask = async (taskData) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
  const newTask = await response.json();
  setTasks([...tasks, newTask]);
};
```

### Add Dark Mode Toggle

Already in Header! Just need to implement:

```javascript
document.documentElement.classList.toggle('dark');
```

---

## 📊 Task Statuses

```javascript
// Status values
const statuses = ['new', 'assigned', 'in-progress', 'done'];

// Status config
const statusConfig = {
  'new': { icon: '🔵', label: 'New', color: 'blue' },
  'assigned': { icon: '🟡', label: 'Assigned', color: 'amber' },
  'in-progress': { icon: '🟠', label: 'In Progress', color: 'pink' },
  'done': { icon: '🟢', label: 'Done', color: 'green' }
};
```

---

## 🐛 Debugging Tips

### Check Component State

```jsx
// Add this to any component to see props
console.log('Props:', props);

// Check context values
const context = useTask();
console.log('TaskContext:', context);
```

### View Tailwind Classes

- Inspect element in DevTools
- Look for `className` attributes
- Check `tailwind.config.js` for theme values

### Common Issues

1. **Drag & Drop not working**: Check `@hello-pangea/dnd` is installed
2. **Styling issues**: Verify Tailwind directives in `index.css`
3. **Context errors**: Ensure component is wrapped in Provider in `App.jsx`

---

## 📦 Adding New Dependencies

```bash
# Install package
npm install package-name

# Install dev package
npm install -D package-name

# Update tailwind config if needed
npm install -D tailwindcss postcss autoprefixer
```

---

## 🎯 Feature Roadmap

### Immediate (v1.1)

- [ ] Real backend API integration
- [ ] User registration/login
- [ ] Persistent database

### Short Term (v1.5)

- [ ] Real-time notifications
- [ ] Advanced filtering
- [ ] Export tasks to CSV
- [ ] Bulk actions

### Long Term (v2.0)

- [ ] Mobile app
- [ ] Team analytics
- [ ] Task templates
- [ ] Integrations (Slack, Email)

---

## 💡 Pro Tips

1. **Use semantic HTML**: Improves accessibility
2. **Test on mobile**: Use responsive design mode in DevTools
3. **Keep components small**: Each file = one responsibility
4. **Use meaningful names**: For components, functions, variables
5. **Add comments**: For complex logic
6. **Use dark mode variants**: `dark:className` for all styles

---

## 📞 Support

For issues or questions:

1. Check `IMPLEMENTATION_COMPLETE.md` for full documentation
2. Review component source code with comments
3. Check `PROJECT_DESIGN.md` for architecture
4. Review `UI_MOCKUP.md` for design system

---

### Happy Coding! 🚀
