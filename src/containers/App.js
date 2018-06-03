import React, { Component } from 'react';
// Import containers
import VideoList from './VideoList';
// Import components
import SearchBar from '../components/SearchBar';
import VideoDetail from '../components/VideoDetail';
import Video from '../components/video';
// Import packages
import axios from 'axios';

const API_END_POINT = 'https://api.themoviedb.org/3/';
const POPULAR_MOVIES_URL = 'discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images';
const SEARCH_URL = "search/movie?language=fr&include_adult=false";

const API_KEY = "api_key=49124c70587c3335fc76661b92d0a962";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movieList: {},
            currentMovie: {}

        }
    }

    componentWillMount() {
        this.initMovies();
    }

    initMovies(){
        // Axios Ajax method
        axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(function(response) {
            // Avec le callback de setState, il est possible d'être sur que le state a été mis à jour
            this.setState({movieList: response.data.results.slice(1,6), currentMovie:response.data.results[0]}, function(){
                this.applyVideoToCurrentMovie();
            })
        }.bind(this));
    }

    applyVideoToCurrentMovie() {
        // Axios method
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&include_adult=false`).then(function(response) {
            console.log(response);
            const youtubeKey = response.data.videos.results[0].key;
            let newCurrentMovieState = this.state.currentMovie;
            newCurrentMovieState.videoId = youtubeKey;
            this.setState({
                currentMovie : newCurrentMovieState
            })

            console.log(newCurrentMovieState);
        }.bind(this));
    }

    onClickListItem(movie) {
        this.setState({currentMovie: movie}, function(){
            this.applyVideoToCurrentMovie();
            this.setRecommandation()
        })
    }

    setRecommandation() {
        
        // Axios Ajax method
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr`).then(function(response) {
            // Avec le callback de setState, il est possible d'être sur que le state a été mis à jour
            this.setState({movieList: response.data.results.slice(0,5)});
        }.bind(this));
    }

    onClickSearch(searchText) {

        if(searchText) {
            // Axios Ajax method
            axios.get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${searchText}`).then(function(response) {
                if(response.data && response.data.results[0]) {
                    if(response.data.results[0].id != this.state.currentMovie.id) {
                        this.setState({currentMovie: response.data.results[0]}, () => {
                            this.applyVideoToCurrentMovie();
                            this.setRecommandation();
                        })
                    } 

                }
            }.bind(this));

        }


        
    }

    render() {

        const renderVideoList = () => {
            if(this.state.movieList.length >= 5) {
               return <VideoList movieList={this.state.movieList} callback={this.onClickListItem.bind(this)}/>
            }
        }

        return (
            <div>
                <div className="search_bar">
                    <SearchBar callback={this.onClickSearch.bind(this)}/>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <Video videoId={this.state.currentMovie.videoId}/>
                        <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview}/>     
                    </div>

                    <div className="col-md-4">
                        {renderVideoList()}
                    </div>
                </div>
            </div>       
        )

    }
    
}

export default App;