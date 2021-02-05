const marvelURL = 'https://gateway.marvel.com/v1/public/',
  apiKey = `apikey=${process.env.REACT_APP_PUBLIC_API_KEY}`,
  ts  = `1`,
  hash = `e00ee4381b62d8aa14363364b7919259`;

const getMarvelCharacters = (options) => {
  const {
    bookmarks,
    offset,
    name,
    exactMatch,
    sortName,
    limit,
  } = Object.assign({
    offset: 0,
    name: '',
    exactMatch: false,
    sortName: '',
    limit: 20,
  }, options);
  
  let url =
    `${marvelURL}characters?ts=${ts}&${apiKey}&hash=${hash}&offset=${offset}&orderBy=${sortName}name&limit=${limit}`;
    if(name=='')
  {
    url = `${marvelURL}characters?ts=${ts}&${apiKey}&hash=${hash}&offset=${offset}&orderBy=${sortName}name&limit=100`;
  }
    if (name) {
    if (exactMatch) { url += `&name=${name}`; }
    else { url += `&nameStartsWith=${name}`; }
  }



  return fetch(url, {
    headers: {'Accept-Encoding':'gzip'}
  })
    .then(res => res.json())
    .then((resObj) => {
      try {
        if (resObj.code === 200) {
          if (offset > resObj.data.total) {
            throw new Error('Page does not exist.');
          } else {
            let pages = Math.floor(resObj.data.total / limit);
           

            return {
              characters: resObj.data.results,
              maxPage: resObj.data.total % limit > 0 ? pages + 1 : pages,
            };
          }
        } else {
          throw new Error(`Marvel API bad response. Status code ${resObj.code}.`);
        }
      } catch (e) {
        console.error(e);
        return {
          characters: [],
          maxPage: 0,
        };
      }
    });
}



const getBookmarkedCharacters = (options) => {
  const {
    bookmarks,
    offset,
    sortName,
    limit,
  } = Object.assign({
    offset: 0,
    name: '',
    exactMatch: false,
    sortName: '',
    limit: 20,
  }, options);

  //`https://gateway.marvel.com:443/v1/public/characters/1009609?apikey=69455535454db051ff7247c28beaafe1`
  const bookmarkedCharacters=[];
  if(!bookmarks){
    return new Promise(resolve => {
      return {
        characters: [],
        maxPage: 0,
      };

    });
  }

  const urls =[];
  //fill urls for ids
  
   bookmarks.forEach(bookmark =>{
    let url =
    `${marvelURL}characters/${bookmark}?&ts=${ts}&${apiKey}&hash=${hash}&offset=${offset}&orderBy=${sortName}name&limit=${limit}`;
    urls.push(url);
  });


 return Promise.all(urls.map(url =>
    fetch(url)
    .then(res => res.json())
    .then((resObj) => {
      try {
        if (resObj.code === 200) {
          if (offset > resObj.data.total) {
            throw new Error('Page does not exist.');
          } else {
              bookmarkedCharacters.push(resObj.data.results[0]);
          }
        } else {
          throw new Error(`Marvel API bad response. Status code ${resObj.code}.`);
        }
      } catch (e) {
        console.error(e);
        return {
          characters: [],
          maxPage: 0,
        };
      }
    })
  ))
  .then(data => {
    console.log("bookmarkedCharacters",bookmarkedCharacters);
    const pages = Math.floor(bookmarkedCharacters.length / limit);
    return {
      characters: bookmarkedCharacters,
      maxPage: bookmarkedCharacters.length % limit > 0 ? pages + 1 : pages,
    };
  });

  
}

export {
  getMarvelCharacters,
  getBookmarkedCharacters
};
