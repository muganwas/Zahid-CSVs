import React, { useState } from 'react';
import csv from 'csv';
import { CSVAddModal } from '../components';
import './style.scss';

export default function Home() {
  const [csvs, updateCsvs] = useState([]);
  const [rawFile, updateRawFile] = useState();
  const [showModal, updateShowModal] = useState(false);

  const _readFile = e => {
    const result = e.target.result;
    if (result) {
      csv.parse(result, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        updateCsvs(data);
        updateShowModal(true);
      });
    }
  };

  const _onInputChange = (e) => {
    e.preventDefault();
    const files = e.target?.files; // if multiple enabled
    const file = files[0];
    updateRawFile(file);
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.addEventListener("load", _readFile);
      reader.readAsBinaryString(file);
    }
  };
  return (
    <>
      {rawFile && <CSVAddModal csvs={csvs} rawFile={rawFile} _onDone={(v) => updateCsvs(v)} showModal={showModal} _onClose={() => updateShowModal(false)} />}
      <div className='home-container'>
        <div className='top-sect'>
          <div id='title'>
            <span id='title-text'>Insect-CSV lists</span>
          </div>
          <div className='button-container'>
            <input onChange={_onInputChange} id='file-input' multiple={false} type='file' style={{ display: 'none' }} />
            <button
              onClick={(e) => {
                e.preventDefault();
                const fileInput = document.getElementById('file-input');
                fileInput.click();
              }}
            >
              Add CSV
            </button>
          </div>
        </div>
        <div className='bottom-sect'>
          {csvs && csvs.map((csv, i) => <div key={i}>{
            csv.title
          }</div>)}
        </div>
      </div>
    </>
  );
}
