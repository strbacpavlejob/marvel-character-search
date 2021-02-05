import React, { Component } from 'react';
import Promise from 'promise';
import { getBookmarkedCharacters,getMarvelCharacters } from './lib/apiCalls';
import './App.css';
import Header from './components/header';
import Character from './components/character';
import Paginator from './components/paginator';
import Filters from './components/filters';
import Loading from './components/loading';


class App extends Component {
  state = {
    loading: false,
    filters: {
      name: {
        value: '',
        exactMatch: false,
      }
    },
    sortName: '',
    characters: [],
    page: 0,
    maxPage: 0,
    limitPerPage: 20,
    bookmarks: [],
  };
  constructor(props) {
    super(props); 
    this.state.bookmarks = JSON.parse(localStorage.getItem('bookmarks-list'));
    this.addBookmark = this.addBookmark.bind(this);
    this.removeBookmark = this.removeBookmark.bind(this);

  } 


  componentWillMount() {
    const data = localStorage.getItem('bookmarks-list');
    if(data){
      this.setState( {
        bookmarks: JSON.parse(data)
    });
    }
    this.search({ sortName: this.state.sortName });
  }

  componentWillUpdate(props, state){
    localStorage.setItem('bookmarks-list', JSON.stringify(this.state.bookmarks));
  }


  addBookmark(id){
    console.log('AddBookmark in App');
    console.log('this.state.bookmarks',this.state.bookmarks);
let arr=[]
if(this.state.bookmarks!=null){
  arr= this.state.bookmarks;
}
 arr.push(id);
 this.setState( {
      bookmarks: arr
  });
  }

  removeBookmark(id){
    console.log('removeBookmark in App', id);
    let arr= this.state.bookmarks;
    arr.pop(id);
 this.setState( {
      bookmarks: arr
  });
  }

  changePage = (page) => {
    if (page !== this.state.page) {
      this.search({
        page,
      });
    }
  }

  nextPages = (maxPage) => {
    this.changePage(maxPage + 1);
  }

  previousPages = (minPage) => {
    if (minPage > 1) {
      this.changePage(minPage - 1)
    }
  }

  applyFilters = () => {
    
    this.search({
      name: this.filters.state.name.trim(),
      exactMatch: this.filters.state.exactMatch,
    }).then(this.afterFilter);
    
    this.setState({
      filters:{
        name:{
          value:  this.filters.state.name.trim()
        }
      }
    })
  }

  search = (options = {}) => {
    this.setState({ loading: true });
    const {
      page,
      name,
      exactMatch,
      sortName,
      limit,
    } = Object.assign({
      page: 1,
      name: this.state.filters.name.value,
      exactMatch: this.state.filters.name.exactMatch,
      sortName: this.state.sortName,
      limit: this.state.limitPerPage,
    }, options);
    const offset = page ? (page - 1) * limit : 0;
    const bookmarks = this.state.bookmarks;
    
    if(!this.state.filters.name.value){
      const p = new Promise((resolve, reject) => {
        getBookmarkedCharacters({ bookmarks, offset, name, exactMatch, sortName, limit })
          .then(({ characters, maxPage }) => {
            this.setState({
              characters,
              maxPage,
              page: characters.length ? page : 0,
              filters: { name: { value: name, exactMatch } },
              sortName,
              limitPerPage: limit,
            });
            resolve({ characters, maxPage, page });
          })
          .catch((error) => reject(error));
      });
      p.done(() => this.setState({ loading: false }));
  
      return p;
    }
    else{
    const p = new Promise((resolve, reject) => {
      getMarvelCharacters({ bookmarks, offset, name, exactMatch, sortName, limit })
        .then(({ characters, maxPage }) => {
          this.setState({
            characters,
            maxPage,
            page: characters.length ? page : 0,
            filters: { name: { value: name, exactMatch } },
            sortName,
            limitPerPage: limit,
          });
          resolve({ characters, maxPage, page });
        })
        .catch((error) => reject(error));
    });
    p.done(() => this.setState({ loading: false }));

    return p;
  }
  }

  resetFilters = () => this.search({ name: '', exactMatch: false }).then(this.afterFilter)

  afterFilter = ({ page, maxPage }) => this.paginator.setPages(page, maxPage)

  sortByName = (event) => this.search({ page: this.state.page, sortName: event.target.value })

  changeLimitPerPage = (event) => this.search({ page: this.state.page, limit: event.target.value })

  render() {
    return (
      <div className="App">
        <Header />

       <Filters ref={filters => this.filters = filters} onApply={this.applyFilters} onReset={this.resetFilters}/>
        {!this.state.loading &&
          <div className="App-characters">{
            this.state.characters
              .map(c => 
              <Character  triggerAddCharacter={this.addBookmark} 
                                    triggerRemoveCharacter={this.removeBookmark} 
                                    bookmarkList = {this.state.bookmarks}
                                    isNameBlank = {this.state.filters.name.value.length===0}
                                    key={c.id} instance={c}/>)
        }</div>}
        {this.state.loading && <Loading />}
        <Paginator ref={paginator => this.paginator = paginator}
                   page={this.state.page}
                   maxPage={this.state.maxPage}
                   onChangePage={this.changePage}
                   onNext={this.nextPages}
                   onPrevious={this.previousPages} />
      </div>
    );
  }
}

export default App;
