'use client';

import { useState, useEffect, useCallback } from 'react';

interface Company {
  id: number;
  url: string;
  name: string;
  description: string;
  products: string;
  featured: boolean;
  newExhibitor: boolean;
  sponsoring: string;
  numberOfEmployees: string;
  marketCap: string;
  additionalInfo: string;
  status: string;
}

interface Filters {
  name: string;
  description: string;
  products: string;
  featured: string;
  newExhibitor: string;
  sponsoring: string;
  employees: string;
  marketCap: string;
  additionalInfo: string;
}

const defaultFilters: Filters = {
  name: '',
  description: '',
  products: '',
  featured: '',
  newExhibitor: '',
  sponsoring: '',
  employees: '',
  marketCap: '',
  additionalInfo: '',
};

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [activeTab, setActiveTab] = useState<'ALL' | 'WISHLIST' | 'REJECTED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (activeTab !== 'ALL') params.set('status', activeTab);
    if (filters.name) params.set('name', filters.name);
    if (filters.description) params.set('description', filters.description);
    if (filters.products) params.set('products', filters.products);
    if (filters.featured) params.set('featured', filters.featured);
    if (filters.newExhibitor) params.set('newExhibitor', filters.newExhibitor);
    if (filters.sponsoring) params.set('sponsoring', 'true');
    if (filters.employees) params.set('employees', filters.employees);
    if (filters.marketCap) params.set('marketCap', filters.marketCap);
    if (filters.additionalInfo) params.set('additionalInfo', filters.additionalInfo);

    try {
      const res = await fetch(`/api/companies?${params.toString()}`);
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(timer);
  }, [fetchCompanies]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCompanies(prev => prev.map(c => c.id === id ? updated : c));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: companies.length,
    wishlist: companies.filter(c => c.status === 'WISHLIST').length,
    rejected: companies.filter(c => c.status === 'REJECTED').length,
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1>✈ AIX 2026 Explorer</h1>
            <p className="header-subtitle">Aircraft Interiors Expo — Company Directory</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-value">{companies.length}</div>
              <div className="stat-label">Showing</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                {companies.filter(c => c.status === 'WISHLIST').length}
              </div>
              <div className="stat-label">Wishlisted</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
                {companies.filter(c => c.status === 'REJECTED').length}
              </div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* SIDEBAR FILTERS */}
        <aside className="sidebar">
          <h2>⚙ Filters</h2>

          <div className="filter-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Search name..."
              value={filters.name}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Search description..."
              value={filters.description}
              onChange={e => setFilters(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <label>Products</label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.products}
              onChange={e => setFilters(f => ({ ...f, products: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <div className="toggle-group">
              <label>Featured</label>
              <select
                value={filters.featured}
                onChange={e => setFilters(f => ({ ...f, featured: e.target.value }))}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <div className="toggle-group">
              <label>New Exhibitor</label>
              <select
                value={filters.newExhibitor}
                onChange={e => setFilters(f => ({ ...f, newExhibitor: e.target.value }))}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <div className="toggle-group">
              <label>Sponsoring</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={filters.sponsoring === 'true'}
                  onChange={e => setFilters(f => ({ ...f, sponsoring: e.target.checked ? 'true' : '' }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label>Number of Employees</label>
            <input
              type="text"
              placeholder="Search employees..."
              value={filters.employees}
              onChange={e => setFilters(f => ({ ...f, employees: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <label>Market Cap</label>
            <input
              type="text"
              placeholder="Search market cap..."
              value={filters.marketCap}
              onChange={e => setFilters(f => ({ ...f, marketCap: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <label>Additional Info</label>
            <input
              type="text"
              placeholder="Search info..."
              value={filters.additionalInfo}
              onChange={e => setFilters(f => ({ ...f, additionalInfo: e.target.value }))}
            />
          </div>

          {hasFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              ✕ Clear All Filters
            </button>
          )}
        </aside>

        {/* TABLE */}
        <div className="table-area">
          {/* TAB BAR */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              All
              <span className="tab-badge">{counts.all}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'WISHLIST' ? 'active' : ''}`}
              onClick={() => setActiveTab('WISHLIST')}
            >
              ★ Wishlist
              <span className="tab-badge">{counts.wishlist}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setActiveTab('REJECTED')}
            >
              ✕ Rejected
              <span className="tab-badge">{counts.rejected}</span>
            </button>
          </div>

          {/* TABLE CONTENT */}
          <div className="table-container">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                Loading companies...
              </div>
            ) : companies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>No companies found</p>
                <p style={{ fontSize: '0.8rem' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Featured</th>
                    <th>New</th>
                    <th>Sponsoring</th>
                    <th>Employees</th>
                    <th>Mkt Cap</th>
                    <th>Additional Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(company => (
                    <tr
                      key={company.id}
                      className={
                        company.status === 'WISHLIST'
                          ? 'row-wishlisted'
                          : company.status === 'REJECTED'
                            ? 'row-rejected'
                            : ''
                      }
                    >
                      <td className="company-url">
                        {company.url ? (
                          <a href={company.url} target="_blank" rel="noopener noreferrer">
                            🔗
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="company-name">{company.name}</div>
                      </td>
                      <td>
                        <div className="cell-truncate">
                          {company.description && company.description !== 'Not given'
                            ? company.description
                            : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </div>
                      </td>
                      <td>
                        <div className="cell-truncate">
                          {company.products && company.products !== 'Not provided'
                            ? company.products
                            : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${company.featured ? 'badge-yes' : 'badge-no'}`}>
                          {company.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${company.newExhibitor ? 'badge-yes' : 'badge-no'}`}>
                          {company.newExhibitor ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        {company.sponsoring && company.sponsoring !== 'No' ? (
                          <span className="badge badge-sponsor">{company.sponsoring}</span>
                        ) : (
                          <span className="badge badge-no">No</span>
                        )}
                      </td>
                      <td>{company.numberOfEmployees || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td>{company.marketCap || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td>
                        <div className="cell-truncate">
                          {company.additionalInfo || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className={`action-btn btn-wishlist ${company.status === 'WISHLIST' ? 'active' : ''}`}
                            onClick={() => updateStatus(company.id, company.status === 'WISHLIST' ? 'NONE' : 'WISHLIST')}
                            disabled={updating === company.id}
                          >
                            {company.status === 'WISHLIST' ? '★ Saved' : '☆ Wishlist'}
                          </button>
                          <button
                            className={`action-btn btn-reject ${company.status === 'REJECTED' ? 'active' : ''}`}
                            onClick={() => updateStatus(company.id, company.status === 'REJECTED' ? 'NONE' : 'REJECTED')}
                            disabled={updating === company.id}
                          >
                            {company.status === 'REJECTED' ? '✕ Rejected' : '✕ Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
