import React from 'react'
import {  useLocation } from 'react-router-dom'
 function Reports() {
  const location=useLocation();
  console.log(location)
  const OGimgURL=location.state? location.state.annotatedImageUrl : null
  const RPimgURL=location.state? location.state.annotatedREPUrl:null
  
  return (
    <div className='reports'>
      <h2>Reports</h2>
      <div>
        {OGimgURL !=null &&(
      <img src={`http://localhost:5000/${encodeURIComponent(OGimgURL)}`} alt="Annotated" />)}
      </div>
      <div>
      {OGimgURL !=null &&(
      <img src={`http://localhost:5000/${encodeURIComponent(RPimgURL)}`} alt="Annotated" />)}
      </div>
    </div>
  )
}
export default Reports