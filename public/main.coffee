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


  getFile = ->
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob)
      alert('The File APIs are not fully supported in this browser.');
      return
    input = document.getElementById('imageForm')
    if (!input)
      alert("Um, couldn't find the fileinput element.")
    else if (!input.files)
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    else if (!input.files[0])
      alert("Please select a file before clicking 'Load'");
    else
      return file = input.files[0]



  window.closedBox = ->
    hasPopup = false
    $('.view.popup').removeClass('active')

  window.renderLinks = (links)->
    renderHTML = ''
    for l in links
      renderHTML = renderHTML + '<a href=' + l.link + 'class="link">' + l.link + '</a>'
    renderHTML = renderHTML + '<p><button class=" exit-btn btn btn-danger" onclick="closedBox()">Closed</button></p>'
    $('.view.popup').html(renderHTML)
  # submit form
  hasPopup = false
  window.submitForm = ->
    name = $('#nameForm').val()
    # city = $('#cityForm').val()
    major = $('#majorForm').val() # school major
    ethnicity = $('#ethinicityForm').find(":selected").text();
    gender = $('#genderForm').find(":selected").text();
    # age = $('#ageForm').val()
    image = getFile()

    ethnicity = if ethnicity == 'African American/Black' then 'African' else ethnicity #hardcoded should be removed
    console.log(ethnicity)
    age = 0 # hardcoded stuff
    # name goes in box
    thisUrl = 'opportunies/q?ethinicity=' + ethnicity
    console.log(thisUrl)
    $.ajax({
    type:'GET',
    url:thisUrl,
    datatype:'json',
    contentType: 'application/json',
    success: (data)->
      renderLinks(JSON.parse(data))
      $('.view.popup').addClass('active')
      hasPopup = true
      # window.location = window.location; # refresh
    })

    # alert('Name: ' + name + ' City: ' + city + ' Major: ' + major + ' Ethinicity: ' + ethnicity + ' Gender: ' + gender + ' Age: ' + age)
    # $('.view.popup').addClass('active')
    # hasPopup = true

  $('.view.last').click ->
    if hasPopup
      console.log('heelo')
      hasPopup = false
      $('.view.popup').removeClass('active')


  $('.view.popup').click (event)->
    event.stopPropagation();
  $('.view.last .submit-buttons').click (event)->
    event.stopPropagation();
