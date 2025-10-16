import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function FixtureDetails(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [id]);

  const fetch = async () => {
    try {
      const resp = await API.get(`/fixtures/${id}`);
      setData(resp.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load fixture');
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this fixture?')) return;
    try {
      await API.delete(`/fixtures/${id}`);
      alert('Deleted');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  if (!data) return <div className="container my-4">Loading...</div>;

  const { fixture, images, categories } = data;

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Fixture Details - #{fixture.FIXTURE_ID}</h5>
          <div>
            <button className="btn btn-warning mr-2" onClick={()=>navigate(`/edit/${fixture.FIXTURE_ID}`)}>Edit</button>
            <button className="btn btn-danger" onClick={onDelete}>Delete</button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>General</h6>
              <table className="table table-sm">
                <tbody>
                  <tr><th>Description</th><td>{fixture.FIXTURE_DESCR}</td></tr>
                  <tr><th>Type</th><td>{fixture.FIXTURE_TYPE}</td></tr>
                  <tr><th>Code</th><td>{fixture.FIXTURE_CODE}</td></tr>
                  <tr><th>Location</th><td>{fixture.FIXTURE_LOCATION}</td></tr>
                  <tr><th>Category</th><td>{fixture.FIXTURE_CATEGORY}</td></tr>
                  <tr><th>Unique ID</th><td>{fixture.FIXTURE_UNIQUE_IDENTIFIER}</td></tr>
                  <tr><th>Avail For Rent</th><td>{fixture.FIXTURE_AVAIL_FOR_RENT ? 'Yes' : 'No'}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <h6>Dimensions</h6>
              <table className="table table-sm">
                <tbody>
                  <tr><th>Unit</th><td>{fixture.FIXTURE_DIMENSION_UNIT}</td></tr>
                  <tr><th>H x W x D</th><td>{fixture.FIXTURE_DIMENTION_HEIGHT} x {fixture.FIXTURE_DIMENTION_WIDTH} x {fixture.FIXTURE_DIMENTION_DEPTH}</td></tr>
                  <tr><th>Floor to Shelf</th><td>{fixture.FIXTURE_FLOOR_TO_SHELF_HEIGHT}</td></tr>
                  <tr><th>Capacity</th><td>{fixture.FIXTURE_CAPACITY_UNITS}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <h6>Categories</h6>
          <div>
            {categories && categories.length ? (
              <table className="table table-sm">
                <thead><tr><th>Category</th><th>Allocated Space</th><th>Elasticity</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.FIXTURE_CATEGORY}>
                      <td>{c.FIXTURE_CATEGORY}</td>
                      <td>{c.ALLOCATED_SPACE}</td>
                      <td>{c.ELASTICITY_COEFFICIENT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div>No categories</div>}
          </div>

          <h6>Images</h6>
          <div className="existing-images">
            {images && images.length ? images.map(img => (
              <div key={img.IMAGE_ID} className="image-card">
                <img alt={img.IMAGE_DESCR} src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/images/${img.IMAGE_ID}`} />
              </div>
            )) : <div>No images</div>}
          </div>

        </div>
      </div>
    </div>
  );
}
