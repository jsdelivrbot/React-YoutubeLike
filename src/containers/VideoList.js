import React from 'react';
import VideoListItem from '../components/VideoListItem'

const VideoList = (props) => {

    const { movieList } = props;

    const receiveCallBack = (movie) => {
        props.callback(movie)
    }

    return(
        <div>
            <ul>
                {
                    movieList.map((movie) => {
                        return <VideoListItem key={movie.id} movie={movie} callback={receiveCallBack}/>
                })}
            </ul>

        </div>

    );
}

export default VideoList;