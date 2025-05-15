import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const ListCategory = () => {

    const [categories, SetCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8000/courses/list/category')
          .then(res => {
            
            SetCategory(res.data);
          })
          .catch(err => {
            console.error('Failed to fetch Category:', err);
            setError('Failed to fetch data. Refresh page.');
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);


  return (
    <div>
        {categories.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No Category available at the moment.</span>
          </div>
        </div>
      ) : (
        categories.map(category => (
          <div class="collapse  collapse-arrow bg-base-100 border border-base-300 text-black">
            <input type="radio" name="my-accordion-3" />
            <div class="collapse-title font-semibold">{category.name}</div>
            {/* <div class="collapse-content text-sm">{syllabus.description}</div> */}
          </div>
        ))
      )}
    </div>
  )
}

export default ListCategory