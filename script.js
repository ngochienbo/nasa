const populateCollage = (numEl) => {
  let collageDisplay = document.querySelector('.collage-display');
  

  let HTMLstr = '';
  for (let i = 0; i < numEl; i++) {
    let HTMLsnippet = 
      `<div class="detail-view-wrapper item-${i}">
        <div class="img-wrapper">
          <img src="img-hd.jpg">
        </div>
        <div class="img-description">
          <h3 class="img-title">A Mercury Transit Sequence</h3>
          <h4 class="img-date">2019-11-10</h4>
          <p class="img-explanation">
            Tomorrow -- Monday --  Mercury will cross the face of the Sun, as seen from Earth. Called a transit, the last time this happened was in 2016.  Because the plane of Mercury's orbit is not exactly coincident with the plane of Earth's orbit, Mercury usually appears to pass over or under the Sun.  The featured time-lapse sequence, superimposed on a single frame, was taken from a balcony in Belgium shows the entire  transit of 2003 May 7.  That solar crossing lasted over five hours, so that the above 23 images were taken roughly 15 minutes apart.  The north pole of the Sun, the Earth's orbit, and Mercury's orbit, although all different, all occur in directions slightly above the left of the image. Near the center and on the far right, sunspots are visible. After Monday, the next transit of Mercury will occur in 2032.   Watch: the November 11 Transit of Mercury from Earth or from Space.
          </p>
        </div>
      </div>`
    HTMLstr += HTMLsnippet;
  }

  collageDisplay.innerHTML = HTMLstr;
}

window.addEventListener('load', function onLoad() {
  populateCollage(9);
})