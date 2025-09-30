"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import AddButton from "@/components/AddButton";
import AddDialog from "@/components/AddDialog";
import { loadLogs, saveLogs } from "@/utils/storage";
import { Search, X, Filter } from "lucide-react";

export default function LogBookApp() {
  const [logs, setLogs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'income', 'expense'
  const [selectedDate, setSelectedDate] = useState(""); // Date filter
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [persons, setPersons] = useState([]);

  // Load logs and persons from localStorage on component mount
  useEffect(() => {
    const loadedLogs = loadLogs();
    // Ensure all logs have proper dates
    const logsWithProperDates = loadedLogs.map(log => {
      if (!log.date) {
        // If no date exists, create one from the ID or use today
        try {
          const timestamp = parseInt(log.id);
          if (!isNaN(timestamp)) {
            return {
              ...log,
              date: new Date(timestamp).toISOString().split('T')[0]
            };
          }
        } catch (error) {
          // If can't extract from ID, use today's date
          return {
            ...log,
            date: new Date().toISOString().split('T')[0]
          };
        }
      }
      return log;
    });
    setLogs(logsWithProperDates);

    const savedPersons = localStorage.getItem("logbookPersons");
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
  }, []);

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  // Filter logs based on search term, filter type, and date
  useEffect(() => {
    let filtered = logs;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.type === filterType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((log) => {
        const personName = getPersonName(log.person).toLowerCase();
        return personName.includes(searchTerm.toLowerCase());
      });
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.date).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return logDate === filterDate;
      });
    }

    setFilteredLogs(filtered);
  }, [searchTerm, filterType, selectedDate, logs, persons]);

  const getPersonName = (personId) => {
    const person = persons.find((p) => p.id === personId);
    return person ? person.name : "Unknown";
  };

  const addLog = (logData) => {
    const newLog = {
      id: Date.now().toString(),
      ...logData,
    };

    setLogs([newLog, ...logs]);
    setIsDialogOpen(false);
  };

  const handlePersonDelete = (updatedLogs, updatedPersons) => {
    setLogs(updatedLogs);
    setPersons(updatedPersons);
  };

  const deleteLog = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  const clearAllLogs = () => {
    if (confirm("Are you sure you want to delete all logs?")) {
      setLogs([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setSelectedDate("");
  };

  const handleDateFilter = (date) => {
    if (!date) {
      setSelectedDate("");
    } else {
      setSelectedDate(date);
    }
  };

  // Calculate totals for all logs
  const totalIncome = logs
    .filter((log) => log.type === "income")
    .reduce((sum, log) => sum + log.amount, 0);

  const totalExpense = logs
    .filter((log) => log.type === "expense")
    .reduce((sum, log) => sum + log.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculate totals for filtered logs
  const filteredIncome = filteredLogs
    .filter((log) => log.type === "income")
    .reduce((sum, log) => sum + log.amount, 0);

  const filteredExpense = filteredLogs
    .filter((log) => log.type === "expense")
    .reduce((sum, log) => sum + log.amount, 0);

  const filteredBalance = filteredIncome - filteredExpense;

  const isFiltered = searchTerm || filterType !== "all" || selectedDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          {/* Search Bar */}
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions by person name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X
                  size={20}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            {/* Type Filter */}
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("income")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "income"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType("expense")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "expense"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Expense
              </button>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                Filter by Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="p-1 border border-gray-300 rounded text-sm"
              />
              {selectedDate && (
                <button
                  onClick={clearDateFilter}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter Results Info */}
          {(searchTerm || filterType !== "all" || selectedDate) && (
            <div className="mt-3 text-sm text-gray-600 flex justify-between items-center">
              <span>
                Showing {filteredLogs.length} of {logs.length} transactions
                {searchTerm && ` for "${searchTerm}"`}
                {filterType !== "all" && ` (${filterType} only)`}
                {selectedDate && ` on ${new Date(selectedDate).toLocaleDateString()}`}
                {filteredLogs.length === 0 && (
                  <span className="text-red-500"> - No matches found</span>
                )}
              </span>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <SummaryCards
          totalIncome={isFiltered ? filteredIncome : totalIncome}
          totalExpense={isFiltered ? filteredExpense : totalExpense}
          balance={isFiltered ? filteredBalance : balance}
          isFiltered={isFiltered}
          onDateFilter={handleDateFilter}
        />

        <TransactionList
          logs={isFiltered ? filteredLogs : logs}
          deleteLog={deleteLog}
          clearAllLogs={clearAllLogs}
        />

        <AddButton onClick={() => setIsDialogOpen(true)} />

        <AddDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onAdd={addLog}
          onPersonDelete={handlePersonDelete}
        />
      </div>
    </div>
  );
}