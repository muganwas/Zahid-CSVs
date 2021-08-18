import React, { useEffect, useState } from 'react';
import { Modal } from '@material-ui/core';
import './style.scss';

export default function CSVAddModal({ csvs, rawFile, showModal, _onDone, _onClose }) {
  const [fileName, updateFileName] = useState('');
  const [previews, updatePreviews] = useState();
  useEffect(() => {
    if (rawFile) {
      const rawFileArr = (rawFile.name).split('.');
      rawFileArr.pop();
      updateFileName(rawFileArr.join(''));
    }
  }, [rawFile]);
  useEffect(() => {
    if (csvs) {
      const newCsvs = [...csvs];
      const prev = newCsvs.splice(0, 4);
      updatePreviews(prev);
    }
  }, [csvs]);
  return (
    <Modal
      className='modal'
      open={showModal}
      onClose={_onClose}
    >
      <div className='csv-details-container'>
        <div className='top-sect'>
          <span id='title-text'>Insect CSV</span>
          {rawFile &&
            <div className='file-info'>
              <span id='file-name'>Name: {fileName}</span>
              <span id='file-description'>Description: {fileName}</span>
              <div className='upload-container'>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    _onDone && _onDone(fileName, csvs[0]);
                  }}
                >
                  Upload
                </button>
              </div>
              <div className='summary-container'>
                {previews?.map((csv, i) => {
                  return (
                    <div style={i === 0 ? { backgroundColor: '#4472C4', color: '#fff', fontWeight: 800, borderBottomWidth: 4 } : {}} className='cols' key={i}>
                      {csv?.map((row, i) => {
                        return (
                          <span key={i}>
                            {row}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>}
        </div>
      </div>
    </Modal>
  );
}
