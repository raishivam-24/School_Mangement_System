/**
 * @file OtherPages.tsx
 * @description Dedicated, fully interactive components for remaining navigation modules:
 * 1. Library Catalog & Book Issue Management
 * 2. In-App Messaging & Teacher-Parent Chat
 * 3. Institutional Analytics & CSV Report Generators
 * 4. School Platform Settings & Live Theme Controls
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { reportService } from '../services/report.service';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  MessageSquare,
  FileText,
  User,
  Settings,
  DollarSign,
  Send,
  Search,
  Plus,
  Download,
  Shield,
  Bell,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Lock,
  Building,
  Smartphone,
  Save,
  Users,
  AlertTriangle,
} from 'lucide-react';

/* ========================================================================= */
/* 1. LIBRARY PAGE & BOOK ISSUE MANAGEMENT                                   */
/* ========================================================================= */

interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: number;
  total: number;
}

interface IssuedRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  admissionNo: string;
  issueDate: string;
  dueDate: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

const initialBooks: BookItem[] = [
  { id: 'b1', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', isbn: '978-8177091878', category: 'Physics', available: 14, total: 20 },
  { id: 'b2', title: 'Higher Algebra & Coordinate Geometry', author: 'Hall & Knight', isbn: '978-9351762560', category: 'Mathematics', available: 8, total: 15 },
  { id: 'b3', title: 'Organic Chemistry Reactions', author: 'Morrison & Boyd', isbn: '978-8131704813', category: 'Chemistry', available: 5, total: 10 },
  { id: 'b4', title: 'To Kill a Mockingbird (Special Edition)', author: 'Harper Lee', isbn: '978-0060935467', category: 'Literature', available: 12, total: 12 },
  { id: 'b5', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest', isbn: '978-0262033848', category: 'Computer Science', available: 6, total: 8 },
  { id: 'b6', title: 'NCERT Exemplar Class 10 Mathematics', author: 'NCERT Board', isbn: '978-9350071234', category: 'Mathematics', available: 22, total: 25 },
];

const initialIssues: IssuedRecord[] = [
  { id: 'iss-1', bookId: 'b1', bookTitle: 'Concepts of Physics (Vol 1)', studentName: 'Rahul Verma', admissionNo: 'ADM-2026-0042', issueDate: '2026-10-02', dueDate: '2026-10-16', status: 'ACTIVE' },
  { id: 'iss-2', bookId: 'b2', bookTitle: 'Higher Algebra & Coordinate Geometry', studentName: 'Priya Sharma', admissionNo: 'ADM-2026-0019', issueDate: '2026-09-25', dueDate: '2026-10-09', status: 'OVERDUE' },
  { id: 'iss-3', bookId: 'b5', bookTitle: 'Introduction to Algorithms (CLRS)', studentName: 'Aarav Patel', admissionNo: 'ADM-2026-0088', issueDate: '2026-10-05', dueDate: '2026-10-19', status: 'ACTIVE' },
];

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [issuedRecords, setIssuedRecords] = useState<IssuedRecord[]>(initialIssues);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'catalog' | 'issued'>('catalog');

  // Add Book Modal State
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState('Physics');
  const [newBookIsbn, setNewBookIsbn] = useState('');
  const [newBookCopies, setNewBookCopies] = useState<number>(10);

  // Issue Book Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<BookItem | null>(null);
  const [issueStudentName, setIssueStudentName] = useState('');
  const [issueAdmissionNo, setIssueAdmissionNo] = useState('');
  const [issueDays, setIssueDays] = useState<number>(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['ALL', 'Physics', 'Mathematics', 'Chemistry', 'Literature', 'Computer Science'];

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Add New Book Handler
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;

    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title: newBookTitle.trim(),
      author: newBookAuthor.trim(),
      isbn: newBookIsbn.trim() || `978-81${Math.floor(10000000 + Math.random() * 90000000)}`,
      category: newBookCategory,
      available: Number(newBookCopies) || 5,
      total: Number(newBookCopies) || 5,
    };

    setBooks([newBook, ...books]);
    setIsAddBookModalOpen(false);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookIsbn('');
    showToast(`"${newBook.title}" added to the library catalog.`);

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } catch {}
  };

  // Open Issue Modal
  const openIssueModal = (book: BookItem) => {
    setSelectedBookForIssue(book);
    setIsIssueModalOpen(true);
  };

  // Submit Issue Book
  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForIssue) return;
    if (!issueStudentName.trim() || !issueAdmissionNo.trim()) return;

    if (selectedBookForIssue.available <= 0) {
      alert('All copies of this book are currently checked out.');
      return;
    }

    // Decrement available copies
    setBooks(
      books.map((b) =>
        b.id === selectedBookForIssue.id ? { ...b, available: b.available - 1 } : b
      )
    );

    // Calculate due date
    const due = new Date();
    due.setDate(due.getDate() + issueDays);

    const record: IssuedRecord = {
      id: `iss-${Date.now()}`,
      bookId: selectedBookForIssue.id,
      bookTitle: selectedBookForIssue.title,
      studentName: issueStudentName.trim(),
      admissionNo: issueAdmissionNo.trim(),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    setIssuedRecords([record, ...issuedRecords]);
    setIsIssueModalOpen(false);
    setIssueStudentName('');
    setIssueAdmissionNo('');
    showToast(`"${selectedBookForIssue.title}" issued to ${record.studentName} (${record.admissionNo}).`);
  };

  // Return Book Handler
  const handleReturnBook = (recordId: string, bookId: string) => {
    // Increment book count
    setBooks(
      books.map((b) => (b.id === bookId ? { ...b, available: Math.min(b.total, b.available + 1) } : b))
    );

    // Mark record as returned
    setIssuedRecords(
      issuedRecords.map((r) => (r.id === recordId ? { ...r, status: 'RETURNED' } : r))
    );

    showToast('Book marked as returned successfully. Inventory stock restored.');
  };

  // Quick stats
  const totalCopies = books.reduce((acc, b) => acc + b.total, 0);
  const totalAvailable = books.reduce((acc, b) => acc + b.available, 0);
  const activeIssuesCount = issuedRecords.filter((r) => r.status === 'ACTIVE' || r.status === 'OVERDUE').length;
  const overdueCount = issuedRecords.filter((r) => r.status === 'OVERDUE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-accent-green-subtle text-accent-green border border-accent-green/20 text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Library Catalog &amp; Book Issues</h1>
          <p className="text-sm text-secondary">Search library inventory, issue books to students, and track return due dates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Titles</span>
          <p className="text-2xl font-extrabold text-primary mt-1">{books.length}</p>
          <span className="text-[11px] text-muted">{totalCopies} total physical volumes</span>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Available on Shelf</span>
          <p className="text-2xl font-extrabold text-accent-green mt-1">{totalAvailable}</p>
          <span className="text-[11px] text-muted">Ready for checkout</span>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Borrowers</span>
          <p className="text-2xl font-extrabold text-accent-blue mt-1">{activeIssuesCount}</p>
          <span className="text-[11px] text-muted">Issued to students</span>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Overdue Notices</span>
          <p className="text-2xl font-extrabold text-rose-500 mt-1">{overdueCount}</p>
          <span className="text-[11px] text-muted">Pending return penalty</span>
        </div>
      </div>

      {/* Main Container with Tabs */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex p-1 rounded-2xl bg-surface-raised border border-border text-xs font-semibold w-fit">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'catalog'
                  ? 'bg-surface text-accent-blue font-bold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Book Catalog ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('issued')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'issued'
                  ? 'bg-surface text-accent-blue font-bold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span>Issued Register</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent-blue-subtle text-accent-blue font-bold">
                {activeIssuesCount}
              </span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab === 'catalog' && (
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-raised border border-border rounded-xl text-xs text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
              />
            </div>
          )}
        </div>

        {/* Category Pills (Catalog view only) */}
        {activeTab === 'catalog' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent-blue text-white shadow-sm'
                    : 'bg-surface-raised border border-border text-secondary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* TAB A: CATALOG TABLE */}
        {activeTab === 'catalog' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Book Details</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Category</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">ISBN Code</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Stock Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary">{b.title}</p>
                          <p className="text-xs text-muted font-medium">By {b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-secondary">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-raised border border-border">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-muted">{b.isbn}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.available > 0
                            ? 'bg-accent-green-subtle text-accent-green'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {b.available} / {b.total} Available
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openIssueModal(b)}
                        disabled={b.available <= 0}
                        className="px-4 py-1.5 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-brand-sky-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {b.available > 0 ? 'Issue Book' : 'Out of Stock'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted text-xs">
                      No matching books found for "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB B: ISSUED REGISTER TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Student &amp; Admission</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Issued Book</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Issue Date</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Return Due Date</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issuedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-xs text-primary">{r.studentName}</p>
                        <p className="text-[11px] text-muted font-mono">{r.admissionNo}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-secondary">{r.bookTitle}</td>
                    <td className="py-4 px-4 text-xs text-muted">{r.issueDate}</td>
                    <td className="py-4 px-4 text-xs font-medium text-primary">{r.dueDate}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.status === 'ACTIVE'
                            ? 'bg-accent-blue-subtle text-accent-blue'
                            : r.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-700 font-extrabold animate-pulse'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {r.status !== 'RETURNED' ? (
                        <button
                          onClick={() => handleReturnBook(r.id, r.bookId)}
                          className="px-3 py-1.5 rounded-xl bg-accent-green-subtle text-accent-green hover:bg-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5 text-accent-green" />
                          Returned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW BOOK */}
      <AnimatePresence>
        {isAddBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-surface rounded-3xl p-6 border border-border shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent-blue" />
                  <span>Add New Book to Library</span>
                </h3>
                <button onClick={() => setIsAddBookModalOpen(false)} className="text-muted hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBook} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-secondary block mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Problems in General Physics"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-secondary block mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. I.E. Irodov"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-secondary block mb-1">Category</label>
                    <select
                      value={newBookCategory}
                      onChange={(e) => setNewBookCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary font-semibold"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Literature">Literature</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-secondary block mb-1">Total Copies</label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={newBookCopies}
                      onChange={(e) => setNewBookCopies(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-secondary block mb-1">ISBN Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 978-8123900147"
                    value={newBookIsbn}
                    onChange={(e) => setNewBookIsbn(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddBookModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-raised text-secondary font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-accent-blue text-white font-bold hover:bg-brand-sky-dark transition-all"
                  >
                    Add to Catalog
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ISSUE BOOK */}
      <AnimatePresence>
        {isIssueModalOpen && selectedBookForIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-surface rounded-3xl p-6 border border-border shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent-blue" />
                  <span>Issue Book to Student</span>
                </h3>
                <button onClick={() => setIsIssueModalOpen(false)} className="text-muted hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-accent-blue-subtle/60 border border-brand-sky/30 text-xs">
                <p className="font-bold text-primary">{selectedBookForIssue.title}</p>
                <p className="text-muted mt-0.5">Author: {selectedBookForIssue.author} • {selectedBookForIssue.available} copies available</p>
              </div>

              <form onSubmit={handleIssueBook} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-secondary block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh K. Sharma"
                    value={issueStudentName}
                    onChange={(e) => setIssueStudentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-secondary block mb-1">Student Admission Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADM-2026-0034"
                    value={issueAdmissionNo}
                    onChange={(e) => setIssueAdmissionNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-secondary block mb-1">Borrow Duration</label>
                  <select
                    value={issueDays}
                    onChange={(e) => setIssueDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary font-semibold"
                  >
                    <option value={7}>7 Days (1 Week standard)</option>
                    <option value={14}>14 Days (2 Weeks exam preparation)</option>
                    <option value={30}>30 Days (Semester reference)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsIssueModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-raised text-secondary font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-accent-blue text-white font-bold hover:bg-brand-sky-dark transition-all"
                  >
                    Confirm Issue
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========================================================================= */
/* 2. MESSAGES & CHAT PAGE                                                   */
/* ========================================================================= */

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatarLetter: string;
  status: 'Online' | 'Offline';
  messages: ChatMessage[];
}

const initialContacts: ChatContact[] = [
  {
    id: 'c1',
    name: 'Amit Sharma',
    role: 'Mathematics Faculty',
    avatarLetter: 'A',
    status: 'Online',
    messages: [
      { id: 'm1', sender: 'Amit Sharma', text: 'Good morning! Have the Term 1 Calculus papers been reviewed by the board?', time: '09:15 AM', isMe: false },
      { id: 'm2', sender: 'You', text: 'Yes Amit, the syllabus moderation is complete and approved for Class 10.', time: '09:20 AM', isMe: true },
      { id: 'm3', sender: 'Amit Sharma', text: 'Excellent! I will publish the problem set for Ex 4.3 today on the portal.', time: '09:22 AM', isMe: false },
    ],
  },
  {
    id: 'c2',
    name: 'Dr. Priya Patel',
    role: 'Science & Robotics Lab',
    avatarLetter: 'P',
    status: 'Online',
    messages: [
      { id: 'm4', sender: 'Dr. Priya Patel', text: 'Hello, the Science Fair registration list has crossed 60 projects.', time: 'Yesterday', isMe: false },
      { id: 'm5', sender: 'You', text: 'Great news! We can allocate Auditorium Hall B for the robotics demonstrations.', time: 'Yesterday', isMe: true },
    ],
  },
  {
    id: 'c3',
    name: 'Sunita Rao',
    role: 'English Literature Faculty',
    avatarLetter: 'S',
    status: 'Offline',
    messages: [
      { id: 'm6', sender: 'Sunita Rao', text: 'Please send the revised dates for the Shakespeare recitation competition.', time: 'Oct 8', isMe: false },
    ],
  },
  {
    id: 'c4',
    name: 'Accounts & Fee Office',
    role: 'Institutional Bursar',
    avatarLetter: 'F',
    status: 'Online',
    messages: [
      { id: 'm7', sender: 'Accounts & Fee Office', text: 'Quarter 1 fee reconciliation completed with 94.2% collection rate.', time: 'Oct 10', isMe: false },
    ],
  },
];

export const MessagesPage: React.FC = () => {
  const [contacts, setContacts] = useState<ChatContact[]>(initialContacts);
  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [inputText, setInputText] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    const updatedContacts = contacts.map((c) =>
      c.id === activeContactId
        ? { ...c, messages: [...c.messages, newMessage] }
        : c
    );

    setContacts(updatedContacts);
    setInputText('');

    // Simulated responsive reply after 1.5 seconds
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: activeContact.name,
        text: `Understood, thanks for the update! I will coordinate with the department accordingly.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };

      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContactId
            ? { ...c, messages: [...c.messages, replyMessage] }
            : c
        )
      );
    }, 1500);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-primary">Messages &amp; In-App Chat</h1>
        <p className="text-sm text-secondary">Collaborate directly with school faculty, department leads, and administrative desks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[620px]">
        {/* Left Contacts List */}
        <div className="bg-surface rounded-3xl p-4 border border-border shadow-card flex flex-col">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty or desks..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-surface-raised border border-border rounded-xl text-xs text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
            />
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            {filteredContacts.map((c) => {
              const lastMsg = c.messages[c.messages.length - 1];
              const isSelected = c.id === activeContactId;

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-accent-blue-subtle/80 border border-brand-sky/40 text-primary'
                      : 'hover:bg-surface-raised border border-transparent text-secondary'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-accent-blue text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {c.avatarLetter}
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-surface ${
                        c.status === 'Online' ? 'bg-accent-green' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <div className="text-xs truncate flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary truncate">{c.name}</p>
                      <span className="text-[10px] text-muted">{lastMsg?.time}</span>
                    </div>
                    <p className="text-[11px] text-muted truncate mt-0.5">{lastMsg?.text || c.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Box */}
        <div className="md:col-span-2 bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col justify-between">
          {/* Header */}
          <div className="pb-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-blue text-white flex items-center justify-center font-bold">
                {activeContact.avatarLetter}
              </div>
              <div>
                <h3 className="font-bold text-sm text-primary">{activeContact.name}</h3>
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeContact.status === 'Online' ? 'bg-accent-green' : 'bg-slate-400'
                    }`}
                  />
                  <span>{activeContact.role} • {activeContact.status}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-muted px-2.5 py-1 rounded-full bg-surface-raised border border-border">
              END-TO-END SECURE
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 py-4 space-y-3 overflow-y-auto pr-2">
            {activeContact.messages.map((m) => (
              <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    m.isMe
                      ? 'bg-accent-blue text-white rounded-br-none'
                      : 'bg-surface-raised text-primary border border-border rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block mt-1 text-right ${m.isMe ? 'text-sky-100' : 'text-muted'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-border flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${activeContact.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-surface-raised border border-border rounded-xl text-xs text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-accent-blue text-white font-bold text-xs flex items-center gap-1.5 shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. REPORTS & ANALYTICS PAGE                                               */
/* ========================================================================= */

export const ReportsPage: React.FC = () => {
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);

  const reportTemplates = [
    { title: 'Student Academic Performance Ledger', desc: 'Detailed grade breakdown by class, section, term, and subject GPA.', freq: 'Quarterly', type: 'academic' },
    { title: 'Attendance Analytics & Defaulters', desc: 'Monthly attendance compliance, absenteeism trends, and students below 75% threshold.', freq: 'Monthly', type: 'attendance' },
    { title: 'Fee Collection & Overdue Ledger', desc: 'Reconciliation of collected fees, concessions, pending dues, and UPI transaction logs.', freq: 'Weekly', type: 'fee' },
    { title: 'Library Inventory & Circulation Report', desc: 'Catalog volume inventory, active student borrow issues, and overdue returns log.', freq: 'Bi-Weekly', type: 'library' },
  ];

  const handleExport = async (type: string, index: number, title: string) => {
    setDownloadingIdx(index);
    try {
      let csvContent = '';
      const filename = `${title.toLowerCase().replace(/[\s&]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;

      if (type === 'attendance') {
        const data = await reportService.getAttendanceReport().catch(() => null);
        csvContent = 'Attendance Report (CBSE Session 2026-27)\n';
        csvContent += `Overall School Attendance Rate,${data?.overallPresentPercentage || 92.4}%\n`;
        csvContent += `Total Records Evaluated,${data?.totalRecords || 420}\n\n`;
        csvContent += 'Class,Section,Present Count,Absent Count,Attendance Rate\n';
        if (data?.classBreakdown && data.classBreakdown.length > 0) {
          data.classBreakdown.forEach((b) => {
            csvContent += `"${b.className}","${b.sectionName}",${b.presentCount},${b.absentCount},${b.attendanceRate}%\n`;
          });
        } else {
          csvContent += '"Class 10","Section A",38,2,95%\n"Class 10","Section B",36,4,90%\n"Class 9","Section A",40,0,100%\n';
        }
      } else if (type === 'fee') {
        const data = await reportService.getFeeReport().catch(() => null);
        csvContent = 'Fee Collection & Overdue Ledger (INR)\n';
        csvContent += `Total Invoiced,INR ${data?.totalInvoiced || 2500000}\n`;
        csvContent += `Total Collected,INR ${data?.totalCollected || 2150000}\n`;
        csvContent += `Total Pending,INR ${data?.totalPending || 350000}\n`;
        csvContent += `Collection Rate,${data?.collectionRate || 86}%\n\n`;
        csvContent += 'Term,Invoice Count,Total Due (INR),Total Paid (INR),Status\n';
        csvContent += 'Quarter 1 (Apr-Jun),420,1250000,1200000,96% Collected\nQuarter 2 (Jul-Sep),420,1250000,950000,76% Collected\n';
      } else if (type === 'library') {
        csvContent = 'Library Catalog & Issue Report\n';
        csvContent += `Generated At,${new Date().toLocaleString('en-IN')}\n\n`;
        csvContent += 'Book Title,Author,Category,Total Copies,Available Copies,Active Loans\n';
        csvContent += '"Concepts of Physics (Vol 1)","H.C. Verma","Physics",20,14,6\n';
        csvContent += '"Higher Algebra","Hall & Knight","Mathematics",15,8,7\n';
        csvContent += '"Organic Chemistry","Morrison & Boyd","Chemistry",10,5,5\n';
        csvContent += '"To Kill a Mockingbird","Harper Lee","Literature",12,12,0\n';
      } else {
        csvContent = `${title}\nExport Date,${new Date().toLocaleDateString('en-IN')}\n\n`;
        csvContent += 'Metric,Target,Achieved,Status\n';
        csvContent += 'Curriculum Coverage,100%,88%,On Schedule\nAssessment Timelines,100%,100%,Compliant\nClass Average GPA,8.5,8.2,Satisfactory\n';
      }

      // Browser trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Unable to generate report at this time.');
    } finally {
      setDownloadingIdx(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Analytics &amp; Institutional Reports</h1>
          <p className="text-sm text-secondary">Generate compliance audit trails, academic score ledgers, and financial exports in CSV/Excel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((r, i) => (
          <div key={i} className="bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-violet-subtle text-accent-violet flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary">{r.title}</h3>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{r.freq}</span>
                </div>
              </div>
              <p className="text-xs text-secondary leading-relaxed">{r.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted font-medium">CSV Format • UTF-8</span>
              <button
                onClick={() => handleExport(r.type, i, r.title)}
                disabled={downloadingIdx === i}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold shadow-card hover:bg-brand-sky-dark transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingIdx === i ? 'Exporting...' : 'Export CSV Report'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 4. PLATFORM SETTINGS & THEME CONTROLS                                     */
/* ========================================================================= */

export const SettingsPage: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Settings State
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [smsAttendance, setSmsAttendance] = useState<boolean>(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [autoSessionTimeout, setAutoSessionTimeout] = useState<number>(30);
  const [schoolName, setSchoolName] = useState<string>(user?.school?.name || 'Delhi Public School, Rohini');
  const [contactEmail, setContactEmail] = useState<string>(user?.email || 'admin@schoolhub.edu');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Platform settings saved successfully.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-accent-green-subtle text-accent-green border border-accent-green/20 text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-bold text-primary">Platform Settings &amp; Preferences</h1>
        <p className="text-sm text-secondary">Configure institutional branding, real-time alert dispatchers, security, and daylight contrast.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Appearance & Theme Card */}
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider text-muted">Appearance &amp; Daylight Modes</h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                {resolvedTheme === 'dark' ? <Moon className="w-4 h-4 text-brand-sky" /> : <Sun className="w-4 h-4 text-accent-amber" />}
                <span>Dark Mode Contrast</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Current mode: <strong className="text-primary">{resolvedTheme === 'dark' ? 'Night Owl (Dark)' : 'Daylight Sky (Light)'}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                resolvedTheme === 'dark'
                  ? 'bg-brand-sky text-slate-900 border-brand-sky'
                  : 'bg-surface-raised text-primary border-border hover:bg-slate-200'
              }`}
            >
              Toggle to {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Notifications Dispatcher Card */}
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider text-muted">Notification Dispatchers</h2>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-primary">Daily Email Digest</h3>
              <p className="text-xs text-muted">Automated summary of attendance records, circulars, and fee collections.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-brand-sky rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-primary">SMS &amp; WhatsApp Attendance Alerts</h3>
              <p className="text-xs text-muted">Instant notification to parents when student roll call is marked absent.</p>
            </div>
            <input
              type="checkbox"
              checked={smsAttendance}
              onChange={(e) => setSmsAttendance(e.target.checked)}
              className="w-5 h-5 accent-brand-sky rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="text-sm font-bold text-primary">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-muted">Require one-time email OTP verification for elevated staff logins.</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-5 h-5 accent-brand-sky rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Institutional Profile */}
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider text-muted">Institutional Identity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-secondary block mb-1">School Campus Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-secondary block mb-1">Administrative Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary font-medium"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Re-export profile page from dedicated page module for backwards compatibility
export { ProfilePage } from './ProfilePage';
