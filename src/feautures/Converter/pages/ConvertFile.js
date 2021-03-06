import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import 'reactstrap';
import Banner from 'components/Banner';
import Images from 'constants/images';
import "./style.css"
import FileApi from 'API/fileApi';
import { useState } from 'react';
import { FileTable } from './../components/FileTable';

ConvertFile.propTypes = {

}

function ConvertFile(props) {

    const [dataFile, setDataFile] = useState([]);
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState(null);
    const [changeData, setChangeData] = useState(0);

    useEffect(() => {
        console.log(sessionStorage.getItem('access_token'));
        FileApi.getFile()
        .then((response) => {
            if(response.status === 1) setDataFile(response.listFile);
            else console.log(response);
        })
   }, [changeData]);


   const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Đang convert... Vui lòng chờ!")
    if(video === null) setMessage("Bạn phải chọn video muốn convert");
    else {
        const formData = new FormData();
        formData.append("video", video);

        FileApi.uploadFile(formData)
        .then((response) => {
            setMessage(response.message);
            if(response.status === 1) {
                setChangeData(changeData + 1);
            }
        })
        .catch(err => console.log(err));
    }
    
  }

  const handleChange = (event) => {
    const file = event.target.files[0];
    setVideo(file);
  }

  const handleRemove = (event) => {
    event.preventDefault();
    // Đầu tiên, xoá nó khỏi array trong state
    const newdata = dataFile.filter(item => item._id !== event.target.id);

    setDataFile(newdata);
    FileApi.removeFile(event.target.id)
    .then((response) => {
        setMessage(response.message);
    })
    .catch((err) => {
        console.log(err);
    })
  }

    return (
        <>
        <Banner title="Convert your video 🎉" backgroundUrl={Images.PINK_BG} message={message} />
        <div className="main-container-file">
            <form onSubmit={handleSubmit}>
                <div className="container-file">
                    <input type="file" onChange={handleChange}/>
                    <button type="submit">Convert File</button>
                </div>
            </form>

            <FileTable dataFile={dataFile} handleRemove={handleRemove}/>
        </div>
        </>
    )
}

export default ConvertFile

