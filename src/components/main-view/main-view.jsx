import React from 'react';
import axios from 'axios';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/loginin-view';


export class MainView extends React.Component {

    constructor(){
        super();
        this.state = {
            movies: [],
            selectedMovie: null
        }    
    }

    onLoggedIn(Username, Password) {
        console.log('Username: ' + Username + ' Password: ' + Password)
        axios.post('https://movie-flix-289893.herokuapp.com/login', 
        {
            Username,
            Password
        }).then(function (response) { 
            localStorage.setItem('token', response.data.token);
        })
        .catch(error => {
            console.log(error);
        });

    }
    componentWillMount() {
        axios.get('https://movie-flix-289893.herokuapp.com/movies', 
        {
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token')             
            }
        })
            .then(response => {
                console.log(response.data);
                this.setState({
                    movies: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    setSelectedMovie(newSelectedMovie) {
        this.setState({
          selectedMovie: newSelectedMovie
        });
      }

    render() {
        const { movies, selectedMovie, user } = this.state;
        console.log(movies)

    /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/
    if (!user) return <LoginView onLoggedIn={(user, pass) => this.onLoggedIn(user, pass)} />;

    // Before the movies have been loaded
    if (movies.length === 0) return <div className="main-view" />;

    return (
      <div className="main-view">
        {/*If the state of `selectedMovie` is not null, that selected movie will be returned otherwise, all *movies will be returned*/}
        {selectedMovie
          ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }}/>
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onMovieClick={(newSelectedMovie) => { this.setSelectedMovie(newSelectedMovie) }}/>
         ))
        }
      </div>
        );
    }
}


export default MainView;