// src/components/FixtureForm.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emptyFixture = {
  START_DATE: '',
  END_DATE: '',
  FIXTURE_DESCR: '',
  FIXTURE_TYPE: '',
  FIXTURE_CODE: '',
  FIXTURE_STATUS: '',
  FIXTURE_DIMENSION_UNIT: '',
  FIXTURE_DIMENTION_HEIGHT: '',
  FIXTURE_DIMENTION_WIDTH: '',
  FIXTURE_DIMENTION_DEPTH: '',
  FIXTURE_FLOOR_TO_SHELF_HEIGHT: '',
  FIXTURE_CAPACITY_UNITS: '',
  FIXTURE_AVAIL_FOR_RENT: false,
  FIXTURE_UNIQUE_IDENTIFIER: '',
  FIXTURE_LOCATION: '',
  FIXTURE_CATEGORY: ''
};

export default function FixtureForm({ editMode }) {
  const [fixture, setFixture] = useState(emptyFixture);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;

  useEffect(() => {
    if (editMode && id) fetchFixture(id);
    // eslint-disable-next-line
  }, [id, editMode]);

  const fetchFixture = async (id) => {
    try {
      const resp = await API.get(`/fixtures/${id}`);
      setFixture(resp.data.fixture || {});
      setImages(resp.data.images || []);
      setCategories(resp.data.categories || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load fixture!');
    }
  };

  const onFileChange = (e) => {
    setImageFiles([...imageFiles, ...e.target.files]);
  };

  const removeImageFile = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await API.delete(`/images/${imageId}`);
      setImages(images.filter(img => img.IMAGE_ID !== imageId));
      toast.success('🗑️ Image deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete image!');
    }
  };

  const addCategoryRow = () => {
    setCategories([...categories, { FIXTURE_CATEGORY: '', ALLOCATED_SPACE: '', ELASTICITY_COEFFICIENT: '' }]);
  };

  const updateCategory = (index, key, value) => {
    const c = [...categories];
    c[index][key] = value;
    setCategories(c);
  };

  const removeCategory = (index) => {
    const c = [...categories];
    c.splice(index, 1);
    setCategories(c);
  };

  const formatDate = (isoDate) => isoDate ? new Date(isoDate).toISOString().split('T')[0] : '';

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && id) {
// ✅ Update fixture (JSON PUT)
        await API.put(`/fixtures/${id}`, {
          ...fixture,
          categories
        });
        toast.success('✅ Fixture updated successfully');

// ✅ Upload images separately if any new files selected
        if (imageFiles.length > 0) {
          const formData = new FormData();
          imageFiles.forEach(f => formData.append('images', f));
          await API.post(`/fixtures/${id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('✅ Images uploaded successfully');
        }
      } else {

// ✅ Add new fixture (FormData with images)
        const formData = new FormData();
        Object.keys(fixture).forEach(k => formData.append(k, fixture[k]));
        formData.append('categories', JSON.stringify(categories));
        imageFiles.forEach(f => formData.append('images', f));

        await API.post('/fixtures', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('✅ Fixture added successfully');
      }

      setFixture(emptyFixture);
      setImageFiles([]);
      setCategories([]);
      navigate('/');
    } catch (err) {
      // console.error(err);
      toast.error('❌ Save / Update Failed');
    }
  };


  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{editMode ? `Edit Fixture #${id}` : 'Add New Fixture'}</h5>
        </div>

        <div className="card-body">
          <form onSubmit={onSubmit}>
            {/* Fixture Identifier */}
            <div className="p-3 border rounded custom-input-box">
              <h6 className="mb-2">Fixture Identifier</h6>
              <div className='row'>
                <div className="col-md-4 form-group">
                  <label>Fixture ID</label>
                  <input className="form-control" placeholder='1001' value={fixture.FIXTURE_ID || ''} onChange={e=>setFixture({...fixture, FIXTURE_ID: e.target.value})} />
                </div>
                <div className="col-md-4 form-group">
                  <label>Unique Identifier *</label>
                  <input className="form-control" value={fixture.FIXTURE_UNIQUE_IDENTIFIER || ''} onChange={e=>setFixture({...fixture, FIXTURE_UNIQUE_IDENTIFIER: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Fixture Dates */}
            <h6 className="mb-2 mt-2">Fixture Details</h6>
            <div className="p-3 mt-3 border rounded custom-input-box">  
              <h6 className="mb-1">Date Period *</h6>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>Start Date *</label>
                  <input type="date" className="form-control" value={formatDate(fixture.START_DATE)} onChange={e=>setFixture({...fixture, START_DATE: e.target.value})} />
                </div>
                <div className="col-md-6 form-group">
                  <label>End Date *</label>
                  <input type="date" className="form-control" value={formatDate(fixture.END_DATE)} onChange={e=>setFixture({...fixture, END_DATE: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Other Fixture Fields */}
            <div className="row mt-2">
              <h6 className="mb-2">Fixture Details</h6>
              <div className="col-md-4 form-group">
                <label>Fixture Location</label>
                <input className="form-control" placeholder='eg. Bavdhan, Pune' value={fixture.FIXTURE_LOCATION || ''} onChange={e=>setFixture({...fixture, FIXTURE_LOCATION: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Fixture Description</label>
                <input className="form-control" value={fixture.FIXTURE_DESCR || ''} onChange={e=>setFixture({...fixture, FIXTURE_DESCR: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Fixture Type</label>
                <input className="form-control" value={fixture.FIXTURE_TYPE || ''} onChange={e=>setFixture({...fixture, FIXTURE_TYPE: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Fixture Code</label>
                <input className="form-control" value={fixture.FIXTURE_CODE || ''} onChange={e=>setFixture({...fixture, FIXTURE_CODE: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Category</label>
                <input className="form-control" value={fixture.FIXTURE_CATEGORY || ''} onChange={e=>setFixture({...fixture, FIXTURE_CATEGORY: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Status</label>
                <input className="form-control" value={fixture.FIXTURE_STATUS || ''} onChange={e=>setFixture({...fixture, FIXTURE_STATUS: e.target.value})} />
              </div>

              {/* Dimension Fields */}
              <div className="col-md-4 form-group">
                <label>Dimension Unit</label>
                <input className="form-control" value={fixture.FIXTURE_DIMENSION_UNIT || ''} onChange={e=>setFixture({...fixture, FIXTURE_DIMENSION_UNIT: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Height</label>
                <input className="form-control" type="number" min="0" step="1" value={fixture.FIXTURE_DIMENTION_HEIGHT || ''} onChange={e=>setFixture({...fixture, FIXTURE_DIMENTION_HEIGHT: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Width</label>
                <input className="form-control" type="number" min="0" step="1" value={fixture.FIXTURE_DIMENTION_WIDTH || ''} onChange={e=>setFixture({...fixture, FIXTURE_DIMENTION_WIDTH: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Depth</label>
                <input className="form-control" type="number" min="0" step="1" value={fixture.FIXTURE_DIMENTION_DEPTH || ''} onChange={e=>setFixture({...fixture, FIXTURE_DIMENTION_DEPTH: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Floor to Shelf Height</label>
                <input className="form-control" type="number" min="0" step="1" value={fixture.FIXTURE_FLOOR_TO_SHELF_HEIGHT || ''} onChange={e=>setFixture({...fixture, FIXTURE_FLOOR_TO_SHELF_HEIGHT: e.target.value})} />
              </div>
              <div className="col-md-4 form-group">
                <label>Capacity Units</label>
                <input className="form-control" type="number" value={fixture.FIXTURE_CAPACITY_UNITS || ''} onChange={e=>setFixture({...fixture, FIXTURE_CAPACITY_UNITS: e.target.value})} />
              </div>
            </div>

            {/* Checkbox */}
            <div className="col-md-4 mb-3 mt-3">
              <input 
                type="checkbox" 
                id="availForRent"
                className="form-check-input me-2"
                checked={fixture.FIXTURE_AVAIL_FOR_RENT}
                onChange={e => setFixture({ ...fixture, FIXTURE_AVAIL_FOR_RENT: e.target.checked })} 
              />
              <label htmlFor="availForRent" className="form-check-label mb-0">Available For Rent</label>
            </div>

            <hr />

            {/* Images */}
            <h6>Fixture Images</h6>
            <div className="mb-2">
              <label className="btn border">
                <i className="fa fa-upload me-2"></i> Upload Images
                <input type="file" multiple onChange={onFileChange} hidden />
              </label>
            </div>
            <div className="existing-images d-flex flex-wrap">
              {images.map(img => (
                <div key={img.IMAGE_ID} className="image-card me-2 mb-2">
                  <img alt={img.IMAGE_DESCR} src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/images/${img.IMAGE_ID}`} />
                  <div className="img-actions">
                    <button type="button" className="btn btn-sm btn-danger" onClick={()=>removeExistingImage(img.IMAGE_ID)}>Delete</button>
                  </div>
                </div>
              ))}
              {imageFiles.map((f, idx) => (
                <div key={idx} className="image-card me-2 mb-2">
                  <img alt={f.name} src={URL.createObjectURL(f)} />
                  <div className="img-actions">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={()=>removeImageFile(idx)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <hr />

            {/* Categories */}
            <div>
              <div className='d-flex justify-content-between mb-2'>
                <h6>Fixture Categories</h6>
                <button type="button" className="btn btn-sm btn-secondary" onClick={addCategoryRow}>+ Add Category</button>
              </div>
              {categories.map((c, idx) => (
                <div key={idx} className="p-2 mt-2 border rounded custom-input-box">
                  <div className="row mb-2">
                    <div className="col-md-3">
                      <label><b>Category Name</b></label>
                      <input placeholder="Category" value={c.FIXTURE_CATEGORY} onChange={e=>updateCategory(idx, 'FIXTURE_CATEGORY', e.target.value)} className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <label><b>Allocated Space</b></label>
                      <input type="number" className="form-control" value={c.ALLOCATED_SPACE} placeholder='0' min="0" step="1" onChange={e => updateCategory(idx, 'ALLOCATED_SPACE', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label><b>Elasticity Coefficient</b></label>
                      <input type="number" placeholder="0.00" value={c.ELASTICITY_COEFFICIENT} onChange={e => updateCategory(idx, 'ELASTICITY_COEFFICIENT', e.target.value)} className="form-control" min="0.00" step="0.50" />                  
                    </div>
                    <div className="col-md-3">
                      <button type="button" className="btn mt-4" onClick={()=>removeCategory(idx)}> 
                        <i className="bi bi-trash3 me-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn btn-primary mt-3" type="submit">
              {editMode ? 'Update' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
