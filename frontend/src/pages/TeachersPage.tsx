/**
 * @file TeachersPage.tsx
 * @description Faculty and Staff management directory with pastel badges, department filters, and modal.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Mail, Phone, BookOpen, Award, MoreVertical, CheckCircle2 } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  subjects: string[];
  avatarUrl: string;
  status: 'ACTIVE' | 'ON_LEAVE';
}

const initialTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    designation: 'Senior PGT Mathematics',
    department: 'Mathematics',
    email: 'amit.sharma@dpa.edu',
    phone: '+91 98765 43210',
    qualification: 'M.Sc. Mathematics, B.Ed',
    experience: '8 Years',
    subjects: ['Calculus', 'Linear Algebra', 'Class 10 Math'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Dr. Priya Patel',
    designation: 'Head of Department - Science',
    department: 'Science',
    email: 'priya.patel@dpa.edu',
    phone: '+91 98765 43211',
    qualification: 'Ph.D. Physics',
    experience: '12 Years',
    subjects: ['Physics (11th & 12th)', 'Thermodynamics'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Sunita Rao',
    designation: 'TGT English Literature',
    department: 'Humanities',
    email: 'sunita.rao@dpa.edu',
    phone: '+91 98765 43212',
    qualification: 'M.A. English, B.Ed',
    experience: '6 Years',
    subjects: ['English Literature', 'Grammar'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    status: 'ACTIVE',
  },
  {
    id: '4',
    name: 'Rajesh Nair',
    designation: 'Computer Science Instructor',
    department: 'Computer Science',
    email: 'rajesh.nair@dpa.edu',
    phone: '+91 98765 43213',
    qualification: 'M.Tech CSE',
    experience: '5 Years',
    subjects: ['Python Programming', 'Database Systems', 'AI Basics'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    status: 'ON_LEAVE',
  },
];

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Teacher form
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: 'Science',
    email: '',
    phone: '',
    qualification: '',
    experience: '1 Year',
  });

  const departments = ['ALL', 'Mathematics', 'Science', 'Humanities', 'Computer Science'];

  const filteredTeachers = teachers.filter((t) => {
    const matchQuery =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchDept = selectedDept === 'ALL' || t.department === selectedDept;
    return matchQuery && matchDept;
  });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = {
      id: String(teachers.length + 1),
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      qualification: formData.qualification,
      experience: formData.experience,
      subjects: ['General Subject'],
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`,
      status: 'ACTIVE',
    };
    setTeachers([newTeacher, ...teachers]);
    setShowAddModal(false);
    setFormData({
      name: '',
      designation: '',
      department: 'Science',
      email: '',
      phone: '',
      qualification: '',
      experience: '1 Year',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Faculty & Teachers</h1>
          <p className="text-sm text-slate-500">Manage teaching staff, qualifications, and class assignments.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-sky text-white font-semibold text-sm shadow-soft hover:bg-brand-sky-dark transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface p-4 rounded-3xl border border-slate-100 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, subject, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
          />
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-brand-lilac text-brand-lilac-dark shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, idx) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-soft transition-all relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-sky-light shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{teacher.name}</h3>
                    <p className="text-xs text-brand-sky-dark font-medium">{teacher.designation}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        teacher.status === 'ACTIVE'
                          ? 'bg-brand-mint-light text-brand-mint-dark'
                          : 'bg-brand-yellow-light text-brand-yellow-dark'
                      }`}
                    >
                      {teacher.status === 'ACTIVE' ? 'Active' : 'On Leave'}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Department & Qualification */}
              <div className="space-y-2 py-3 border-y border-slate-50 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-lilac-dark shrink-0" />
                  <span className="font-medium">{teacher.qualification} ({teacher.experience})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              {/* Assigned Subjects */}
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Subjects Assigned
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <button className="text-xs font-semibold text-brand-sky-dark hover:underline flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> View Schedule
              </button>
              <button className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all">
                Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-1">Add New Faculty Member</h2>
            <p className="text-xs text-slate-500 mb-6">Enter personal, academic, and department details.</p>

            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="PGT Physics"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@school.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc, B.Ed"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-sky text-white font-semibold text-sm shadow-soft hover:bg-brand-sky-dark transition-all"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
