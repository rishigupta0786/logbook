export const loadLogs = () => {
  try {
    const savedLogs = localStorage.getItem('logbookEntries');
    return savedLogs ? JSON.parse(savedLogs) : [];
  } catch (error) {
    console.error('Error loading logs from localStorage:', error);
    return [];
  }
};

export const saveLogs = (logs) => {
  try {
    localStorage.setItem('logbookEntries', JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving logs to localStorage:', error);
  }
};