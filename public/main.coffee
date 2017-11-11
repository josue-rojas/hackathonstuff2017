document.addEventListener "DOMContentLoaded", ->
  positions = []
  window.getPositions = ->
    positions = []
    $('.view').each ->
      positions.push($(this).position().top)
    return positions
  getPositions()
  $(window).resize(getPositions)


  scrollTimeOut = null
  window.scrollToPos = (change,currPos, targetPos, down) ->
    if currPos == targetPos
      return
    currPos = currPos+change
    if down
      if currPos > targetPos
        currPos = targetPos
      change = if change > 0 and change < 30 then change+.25 else change
    else
      if currPos < targetPos
        currPos = targetPos
      change = if change < 0 and change > -30 then change-.25 else change
    window.scrollTo(0,currPos)
    scrollTimeOut = setTimeout(scrollToPos, 1, change, currPos, targetPos, down)

  $(window).keydown (e)->
    currPos = $(this).scrollTop()
    if e.which == 38
      clearTimeout(scrollTimeOut)
      targetPos = positions.filter (element)->
        return element < currPos
      targetPos = if targetPos[targetPos.length-1] then targetPos[targetPos.length-1] else positions[0]
      scrollToPos(change=-.50, currPos, targetPos, false)
    else if e.which == 40
      clearTimeout(scrollTimeOut)
      targetPos = positions.find (element)->
        return element > currPos
      targetPos = if targetPos then targetPos else positions[positions.length-1]
      scrollToPos(change=.50, currPos, targetPos, true)

  # scroll navigations
  removeClass = ->
    $('.view.first').removeClass('isScroll')
  scrollT = ''
  $(window).scroll ->
    $('.view.first').addClass('isScroll')
    clearTimeout(scrollT);
    scrollT = setTimeout(removeClass, 200)
  # scroll with press enter
  $(".form-control").on 'keyup', (e)->
    if e.keyCode == 13
      currPos = $(window).scrollTop()
      clearTimeout(scrollTimeOut)
      targetPos = positions.find (element)->
        return element > currPos
      targetPos = if targetPos then targetPos else positions[positions.length-1]
      scrollToPos(change=.50, currPos, targetPos, true)

  # submit form
  submitForm = ->
    name = $('#nameForm').val()
    city = $('#cityForm').val()
    major = $('#majorForm').val() // school major
    ethnicity = $('#ethinicityForm').val()
    gender = $('#genderForm').val()
    age = $('#ageForm').val()
    alert('Name: ' + name + ' City: ' + city + ' Major: ' + major + ' Ethinicity: ' + ethnicity + ' Gender: ' + gender + ' Age: ' + age)
