import React, { useState } from 'react';
import axios from 'axios';
import csv from 'csv';
import { CSVAddModal } from '../components';
import './style.scss';

const baseURL = process.env.REACT_APP_BACKEND_API;

export default function Home() {
  const [csvs, updateCsvs] = useState([]);
  const [rawFile, updateRawFile] = useState();
  const [showModal, updateShowModal] = useState(false);
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
    const files = e.target?.files; // if multiple enabled
    const file = files[0];
    updateRawFile(file);
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.addEventListener("load", _readFile);
      reader.readAsBinaryString(file);
    }
  };

  const _onClose = () => {
    updateShowModal(false);
    updateRawFile(null);
    updateCsvs([]);
  };

  const toTimestamp = (date) => {
    const dt = Date.parse(date);
    return dt / 1000;
  };

  const _onDone = async (name, rows) => {
    const createTableURI = baseURL + 'create-table';
    const instertURI = baseURL + 'saveCSV';
    const newRows = [...rows];
    const titleArr = [...rows[0]];
    const valRows = newRows.splice(1, rows.length);
    const trimRows = [];
    const rowObjectArr = [];
    const rowValObjectArr = [];
    await titleArr.forEach(e => trimRows.push(((e.replace(/['"]+/g, '')).trim()).replace(/\s/g, '_'))); //remove whitespace, queotes then replace spaces with a "_"
    await trimRows.forEach(e => rowObjectArr.push({ name: e, type: 'string' }));
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

            }
          }).catch(e => {
            console.log('insert err ', e);
          });
        }
      }).catch(e => {
        console.log('err ', e);
      });
    }
  };
  return (
    <>
      {rawFile &&
        <CSVAddModal
          csvs={csvs}
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
        <div className='bottom-sect'>
          {csvs && csvs.map((csv, i) => <div key={i}>{
            csv.title
          }</div>)}
        </div>
      </div>
    </>
  );
}
