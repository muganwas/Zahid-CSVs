import React, { useState } from 'react';
import axios from 'axios';
import csv from 'csv';
import { CSVAddModal } from '../components';
import './style.scss';

const baseURL = process.env.REACT_APP_BACKEND_API;

export default function Home() {
  const [csvs, updateCsvs] = useState([]);
  const [rawFile, updateRawFile] = useState();
  const [rawFiles, updateRawFiles] = useState([]);
  const [showModal, updateShowModal] = useState(false);
  const [loading, updateLoading] = useState(false);
  const [err, updateError] = useState('');
  const [val] = useState('');

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
    const files = Array.from(e.target?.files); // if multiple enabled
    const file = files[0];
    if (file && file.type === 'text/csv') {
      const newRawFiles = rawFiles ? [...Array.from(rawFiles)] : [];
      updateRawFile(file);
      updateRawFiles([...newRawFiles, file]);
      const reader = new FileReader();
      reader.addEventListener("load", _readFile);
      reader.readAsBinaryString(file);
    }
  };

  const _onClose = () => {
    updateShowModal(false);
    updateRawFile(null);
  };

  const toTimestamp = async (date) => {
    const dt = Date.parse(date);
    return dt / 1000;
  };

  const _onDone = async (name, rows) => {
    updateLoading(true);
    const createTableURI = baseURL + 'create-table';
    const instertURI = baseURL + 'saveCSV';
    const newRows = [...rows];
    const titleArr = [...rows[0]];
    const valRows = newRows.splice(1, rows.length);
    const trimRows = [];
    const rowObjectArr = [];
    const rowValObjectArr = [];

    await titleArr.forEach(e => trimRows.push(((e.replace(/['"]+/g, '')).trim()).replace(/\s/g, '_'))); //remove whitespace, queotes then replace spaces with a "_"
    await trimRows.forEach(async (e, i) => {
      const current = valRows[0][i];
      const currentLabel = e.toLowerCase();
      const petentialTS = currentLabel.includes('date') || currentLabel.includes('time'); // keywords for potential timestamps, could be removed entirely but would affect performance
      let timestamp = false;
      if (petentialTS) {
        const ts = await toTimestamp(current);
        timestamp = ts > 0;
      }
      rowObjectArr.push({ name: e, type: timestamp ? 'timestamp' : 'string' });
    });
    await valRows.map(async r => {
      const currentRow = [];
      await r.map((v, i) => currentRow.push({ name: rowObjectArr[i].name, value: (v.replace(/['"]+/g, '')).trim() }));
      rowValObjectArr.push(currentRow);
    });
    if (name) {
      axios.post(createTableURI, { "table_name": name, "table_rows": rowObjectArr }).then((res) => {
        if (res.status === 200) {
          axios.post(instertURI, { "table_name": name, "table_rows": rowValObjectArr }).then(res => {
            if (res.status === 200) {
              updateLoading(false);
              updateError('');
              _onClose();
            }
          }).catch(e => {
            updateLoading(false);
            updateError('Something went wrong, try again later');
            console.log('insert err ', e);
          });
        }
      }).catch(e => {
        updateLoading(false);
        updateError('Something went wrong, try again later');
        console.log('err ', e);
      });
    }
  };
  return (
    <>
      {rawFile &&
        <CSVAddModal
          csvs={csvs}
          loading={loading}
          error={err}
          rawFile={rawFile}
          _onDone={_onDone}
          showModal={showModal}
          _onClose={_onClose}
        />}
      <div className='home-container'>
        <div className='top-sect'>
          <div id='title'>
            <span id='title-text'>Insect-CSV lists</span>
          </div>
          <div className='button-container'>
            <input onChange={_onInputChange} id='file-input' value={val} multiple={false} type='file' style={{ display: 'none' }} />
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
        {rawFiles && rawFiles.length > 0 && <div className='bottom-sect'>
          <div id='files-title'>Title</div>
          {rawFiles && Array.from(rawFiles).map((csv, i) => {
            return <div className='files-list' key={i}>
              <span>{csv.name}</span>
              <div className='buttons-container'>
                <button
                  onClick={() => {
                    updateRawFile(rawFiles[i]);
                    updateShowModal(true);
                  }}
                >Show</button>
                <button
                  onClick={() => {
                    const newRawFiles = rawFiles.splice(i, 1);
                    updateRawFile(newRawFiles);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>;
          }
          )}
        </div>}
      </div>
    </>
  );
}
