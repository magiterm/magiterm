const React = require('react');

const VideoSearchResults = ({ videos, handleSearchedVideoClick, handleSearchNext, handleSearchPrev }) => {

  if(!videos || videos.length === 0) {
    return <div></div>
  }



  return (
    <div className="video-search-image-container row">
      <button className="search-prev slick-arrow slick-prev" onClick={handleSearchPrev}>
        <i className="ion-ios-arrow-back prev-icon"></i>
      </button>
      { videos.map((video, i) => {
          return (
            <div className="video-search-image-container-inner" key={i} >
              <img
                  key={video.id.videoId} 
                  src={video.snippet.thumbnails.medium.url} 
                  onClick={handleSearchedVideoClick.bind(null, video)} />
              <div className="front-layer" onClick={handleSearchedVideoClick.bind(null, video)} >
                <p>{video.snippet.title}</p>
                <i className="ion-ios-plus-outline"/>
              </div>
              <p className="video-search-description" key={i} >{video.snippet.description}</p>
            </div>
          )
        })
      }
      <button className="search-next slick-arrow slick-next" onClick={handleSearchNext}>
        <i className="ion-ios-arrow-forward next-icon"></i>
      </button>
    </div>

  )
}

module.exports = VideoSearchResults;