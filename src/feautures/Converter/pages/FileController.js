import React, { useEffect } from 'react'
import 'reactstrap';
import Banner from 'components/Banner';
import Images from 'constants/images';
import "./style.css"
import FileApi from 'API/fileApi';
import { useState } from 'react';
import { FileTable } from './../components/FileTable';

function FileController(props) {

    const [dataFile, setDataFile] = useState([]);
    const [message, setMessage] = useState(null);
    const [changeData, setChangeData] = useState(0);

    useEffect(() => {
        console.log(sessionStorage.getItem('access_token'));
        FileApi.getFile()
        .then((response) => {
            console.log(response);
            if(response.status === 1) setDataFile(response.listFile);
        })
   }, [changeData]);

  const handleRemove = (event) => {
    event.preventDefault();

    FileApi.removeFile(event.target.id)
    .then((response) => {
        setMessage(response.message);
        if(response.status === 1) {
            setChangeData(changeData + 1);
        }
    })
    .catch((err) => {
        console.log(err);
    })

  }

    return (
        <>
        <Banner title="Control Your File 🎉" backgroundUrl={Images.BLUE_BG} message={message}/>
        <div className="main-container-file">
            <FileTable dataFile={dataFile} handleRemove={handleRemove}/>
        </div>
        </>
    )
}

export default FileController

