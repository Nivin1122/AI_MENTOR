import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListSyllabus = () => {
  const [syllabuses, setSyllabus] = useState([]);
  const [openAccordion, setOpenAccordion] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0)



  useEffect(()=>{
    setTimeout(()=>{
      if (progress < 60){
        setProgress(progress+1)
      }
    },5)
    console.log(progress)
  }, [progress])

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/courses/list/syllabus')
      .then(res => {
        console.log('Data received:123', res.data);
        setSyllabus(res.data);

        const accordionState = {};
        res.data.forEach(item => {
          accordionState[item.id] = false;
        });
        setOpenAccordion(accordionState);
      })
      .catch(err => {
        console.error('Failed to fetch syllabuses:', err);
        setError('Failed to fetch data. Refresh page.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  

  // Toggle accordion open/close state
  const toggleAccordion = (id) => {
    setOpenAccordion(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {error ? (
        <div className="alert alert-warning shadow-lg mb-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
        </div>
      ):<div className="radial-progress" style={{"--value":progress}} aria-valuenow={progress} role="progressbar">{progress}%</div>}
      
      {syllabuses.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No syllabuses available at the moment.</span>
          </div>
        </div>
      ) : (
        syllabuses.map(syllabus => (
          <div class="collapse  collapse-arrow bg-base-100 border border-base-300 text-black">
            <input type="radio" name="my-accordion-3" />
            <div class="collapse-title font-semibold">{syllabus.course.category.name}</div>
            <div class="collapse-content text-sm">{syllabus.description}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListSyllabus;