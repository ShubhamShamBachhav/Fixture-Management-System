import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function FixtureList() {
  const [filters, setFilters] = useState({
    FIXTURE_ID: '',
    FIXTURE_DESCR: '',
    FIXTURE_TYPE: '',
    FIXTURE_CODE: '',
    FIXTURE_LOCATION: '',
    FIXTURE_CATEGORY: '',
    FIXTURE_UNIQUE_IDENTIFIER: ''
  });
  const [fixtures, setFixtures] = useState([]);
  const navigate = useNavigate();

  const fetchFixtures = async () => {
    try {
      const resp = await API.get('/fixtures', { params: filters });
      setFixtures(resp.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching fixtures');
    }
  };

  useEffect(() => {
    fetchFixtures();
    // eslint-disable-next-line
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchFixtures();
  };

  const onClear = () => {
    setFilters({
      FIXTURE_ID: '',
      FIXTURE_DESCR: '',
      FIXTURE_TYPE: '',
      FIXTURE_CODE: '',
      FIXTURE_LOCATION: '',
      FIXTURE_CATEGORY: '',
      FIXTURE_UNIQUE_IDENTIFIER: ''
    });
    setFixtures([]);
  };

  const onDelete = async (id) => {
  if (!window.confirm('Delete this fixture?')) return;
  try {
    await API.delete(`/fixtures/${id}`);
    fetchFixtures(); // reload data
  } catch (err) {
    console.error(err);
    // Popup handled automatically
  }
};


  return (
    <div className="container my-4 p-3 border rounded custom-input-box">
      <div className="card shadow-sm ">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Search Filters</h5>
        </div>

        <div className="card-body">
          <form onSubmit={onSearch} className="filter-form">
            <div className="row">
              <div className="col-md-4">
                <label>Fixture ID</label>
                <input  placeholder="Search by Fixture ID" value={filters.FIXTURE_ID} onChange={e=>setFilters({...filters, FIXTURE_ID:e.target.value})} className="form-control" />
              </div>
              <div className="col-md-4">
                <label>Fixture Description</label>
                <input  placeholder="Search by Description" value={filters.FIXTURE_DESCR} onChange={e=>setFilters({...filters, FIXTURE_DESCR:e.target.value})} className="form-control" />
              </div>
              <div className="col-md-4">
                <label>Fixture Type</label>
                <input  placeholder="Search by Type" value={filters.FIXTURE_TYPE} onChange={e=>setFilters({...filters, FIXTURE_TYPE:e.target.value})} className="form-control" />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <label>Fixture Code</label>
                <input  placeholder="Search by Code" value={filters.FIXTURE_CODE} onChange={e=>setFilters({...filters, FIXTURE_CODE:e.target.value})} className="form-control" />
              </div>
              <div className="col-md-4">
                <label>Location</label>
                <input  placeholder="Search by location" value={filters.FIXTURE_LOCATION} onChange={e=>setFilters({...filters, FIXTURE_LOCATION:e.target.value})} className="form-control" />
              </div>
              <div className="col-md-4">
                <label>Category</label>
                <input  placeholder="Search by Category" value={filters.FIXTURE_CATEGORY} onChange={e=>setFilters({...filters, FIXTURE_CATEGORY:e.target.value})} className="form-control" />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <label>Unique Identifier</label>
                <input  placeholder="Search by Identifier" value={filters.FIXTURE_UNIQUE_IDENTIFIER} onChange={e=>setFilters({...filters, FIXTURE_UNIQUE_IDENTIFIER:e.target.value})} className="form-control" />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-search mr-2" >  <i className="fas fa-search mr-2"></i>  Search</button>
                <button type="button" onClick={onClear} className="btn btn-outline-secondary ms-2"> Reset </button>
              </div>
            </div>
         
          </form>
      </div>
    </div>
        
          <div>
            <Link to="/add" className="btn btn-primary mt-4 mb-4"> + Add New Fixture</Link>
          </div>


          <div className="table-responsive p-3 border rounded custom-input-box">
            <table className="table table-striped table-hover">
              <thead className="table-head">
                <tr>
                  <th>Fixture ID</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Code</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Identifier</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.length === 0 ? (
                  <tr><td colSpan="8">No records. Click Add New Fixture to create.</td></tr>
                ) : fixtures.map(f => (
                  <tr key={f.FIXTURE_ID}>
                    <td>{f.FIXTURE_ID}</td>
                    <td>{f.FIXTURE_DESCR}</td>
                    <td>{f.FIXTURE_TYPE}</td>
                    <td>{f.FIXTURE_CODE}</td>
                    <td>{f.FIXTURE_LOCATION}</td>
                    <td>{f.FIXTURE_CATEGORY}</td>
                    <td>{f.FIXTURE_UNIQUE_IDENTIFIER}</td>
                    {/* start and end date below----- */}
                    { <td>{f.START_DATE ? new Date(f.START_DATE).toLocaleDateString('en-GB') : ''}</td> }
                    <td>{f.END_DATE ? new Date(f.END_DATE).toLocaleDateString('en-GB') : ''}</td>

                    {/* <td>{f.START_DATE}</td>
                    <td>{f.END_DATE}</td> */}

                    <td> 
                      <button className="btn btn-sm" style={{ backgroundColor: '#e7f5eaff', color: '#0f962fff', fontWeight: 'bold', cursor: 'default'}}>
                        {f.FIXTURE_STATUS} 
                      </button>
                    </td>

                    <td>
                      <button className="btn btn-sm btn-info " onClick={()=>navigate(`/fixture/${f.FIXTURE_ID}`)}>View</button>
                      <button className="btn btn-sm btn-warning ms-1" onClick={()=>navigate(`/edit/${f.FIXTURE_ID}`)}>Update</button>
                      <button className="btn btn-sm btn-danger ms-1" onClick={()=>onDelete(f.FIXTURE_ID)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      
   
  );
}
