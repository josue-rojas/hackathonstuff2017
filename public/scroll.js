(function() {
  document.addEventListener("DOMContentLoaded", function() {
    var positions, scrollTimeOut;
    positions = [];
    window.getPositions = function() {
      positions = [];
      $('.view').each(function() {
        return positions.push($(this).position().top);
      });
      return positions;
    };
    getPositions();
    $(window).resize(getPositions);
    scrollTimeOut = null;
    window.scrollToPos = function(change, currPos, targetPos, down) {
      if (currPos === targetPos) {
        return;
      }
      currPos = currPos + change;
      if (down) {
        if (currPos > targetPos) {
          currPos = targetPos;
        }
        change = change > 0 && change < 30 ? change + .25 : change;
      } else {
        if (currPos < targetPos) {
          currPos = targetPos;
        }
        change = change < 0 && change > -30 ? change - .25 : change;
      }
      window.scrollTo(0, currPos);
      return scrollTimeOut = setTimeout(scrollToPos, 1, change, currPos, targetPos, down);
    };
    return $(window).keydown(function(e) {
      var change, currPos, targetPos;
      currPos = $(this).scrollTop();
      if (e.which === 38) {
        clearTimeout(scrollTimeOut);
        targetPos = positions.filter(function(element) {
          return element < currPos;
        });
        targetPos = targetPos[targetPos.length - 1] ? targetPos[targetPos.length - 1] : positions[0];
        return scrollToPos(change = -.50, currPos, targetPos, false);
      } else if (e.which === 40) {
        clearTimeout(scrollTimeOut);
        targetPos = positions.find(function(element) {
          return element > currPos;
        });
        targetPos = targetPos ? targetPos : positions[positions.length - 1];
        return scrollToPos(change = .50, currPos, targetPos, true);
      }
    });
  });

  // scrollToPos(1, $(this).scrollTop(), positions[1])
// lastScrollTop = 0;
// $(window).scroll (event)->
//   currPos = $(this).scrollTop()
//   if currPos > lastScrollTop
//     scrollToPos(change=1, currPos, positions[1])
//   else
//     return
//     scrollToPos(change=-1, currPos, positions[0])
//   lastScrollTop = currPos

}).call(this);


document.addEventListener("DOMContentLoaded", function() {
  $(window).scroll(function() {
    $('.view.first').addClass('isScroll')
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
      $('.view.first').removeClass('isScroll')
      console.log("Haven't scrolled in 250ms!");
    }, 200));
});
  // $('.view.first .welcome-text').hover(function(){
  //   $('.view.first .hover').addClass('isHover')
  // },function(){
  //   $('.view.first .hover').removeClass('isHover')
  // })
})


function submitForm(){
  name = $('#nameForm').val()
  city = $('#cityForm').val()
  major = $('#majorForm').val() // school major
  ethnicity = $('#ethinicityForm').val()
  gender = $('#genderForm').val()
  age = $('#ageForm').val()
  alert('Name: ' + name + ' City: ' + city + ' Major: ' + major + ' Ethinicity: ' + ethnicity + ' Gender: ' + gender + ' Age: ' + age)
}
