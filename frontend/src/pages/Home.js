import React, { useState } from 'react';
import { CSVAddModal } from '../components';

export default function Home() {
  const [csvs, updateCsvs] = useState([]);
  const [showModal, updateShowModal] = useState(false);
  return (
    <>
      <CSVAddModal csvs={csvs} onDone={(v) => updateCsvs(v)} showModal={showModal} _onClose={() => updateShowModal(false)} />
      <div className='home-container'>
        <div>
          <span>insert-CSV lists</span>
          <button onClick={() => updateShowModal(true)}>Add CSV</button>
        </div>
        <div>
          {csvs && csvs.map(csv => <div>{
            csv.title
          }</div>)}
        </div>
      </div>
    </>
  );
}
