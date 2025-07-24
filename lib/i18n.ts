export type Language = "en" | "tr"

export const translations = {
  en: {
    // Header
    title: "TaskForge",
    subtitle: "Manage your tasks efficiently",
    newTask: "New Task",

    // Search and filters
    searchTasks: "Search tasks...",
    allPriority: "All Priority",

    // Task statuses
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done",

    // Priority levels
    high: "High",
    medium: "Medium",
    low: "Low",

    // Task form
    createTask: "Create New Task",
    editTask: "Edit Task",
    description: "Description",
    status: "Status",
    priority: "Priority",
    dueDate: "Due Date",
    labels: "Labels",
    addLabel: "Add a label",
    cancel: "Cancel",
    createTaskBtn: "Create Task",
    updateTask: "Update Task",

    // Task actions
    edit: "Edit",
    delete: "Delete",
    openMenu: "Open menu",

    // Placeholders
    enterTaskTitle: "Enter task title",
    enterTaskDescription: "Enter task description",
    noTasksYet: "No tasks yet",

    // Languages
    language: "Language",
    english: "English",
    turkish: "Turkish",

    // Theme
    toggleTheme: "Toggle theme",
  },
  tr: {
    // Header
    title: "TaskForge",
    subtitle: "Görevlerinizi verimli bir şekilde yönetin",
    newTask: "Yeni Görev",

    // Search and filters
    searchTasks: "Görev ara...",
    allPriority: "Tüm Öncelikler",

    // Task statuses
    todo: "Yapılacak",
    inProgress: "Devam Ediyor",
    done: "Tamamlandı",

    // Priority levels
    high: "Yüksek",
    medium: "Orta",
    low: "Düşük",

    // Task form
    createTask: "Yeni Görev Oluştur",
    editTask: "Görevi Düzenle",
    description: "Açıklama",
    status: "Durum",
    priority: "Öncelik",
    dueDate: "Bitiş Tarihi",
    labels: "Etiketler",
    addLabel: "Etiket ekle",
    cancel: "İptal",
    createTaskBtn: "Görev Oluştur",
    updateTask: "Görevi Güncelle",

    // Task actions
    edit: "Düzenle",
    delete: "Sil",
    openMenu: "Menüyü aç",

    // Placeholders
    enterTaskTitle: "Görev başlığını girin",
    enterTaskDescription: "Görev açıklamasını girin",
    noTasksYet: "Henüz görev yok",

    // Languages
    language: "Dil",
    english: "İngilizce",
    turkish: "Türkçe",

    // Theme
    toggleTheme: "Tema değiştir",
  },
}

export function getTranslation(key: string, language: Language): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
