/* eslint-env jquery, browser */
$(document).ready(() => {
  // Form submission JS. Served only on the create account page
  $('#create-new-account').on('click', event => {
    event.preventDefault()
    const errorArray = []
    let errors = false
    if (
      !$('#create-username')
        .val()
        .trim()
        .match(/^[a-zA-Z0-9 _-]{6,15}$/)
    ) {
      errors = true
      errorArray.push(
        "'Username' field must be from 6 to 15 characters with no special characters!"
      )
    }
    if (
      !$('#create-password')
        .val()
        .trim()
        .match(/^[a-zA-Z0-9 _-]{6,15}$/)
    ) {
      errors = true
      errorArray.push(
        "'Password' field must be from 6 to 15 characters with no special characters!"
      )
    }
    if (
      !$('#create-email')
        .val()
        .trim()
        .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      errors = true
      errorArray.push("'Email' field was blank or not in the proper format!")
    }
    if (
      $('#create-password')
        .val()
        .trim() !==
      $('#create-password-verify')
        .val()
        .trim()
    ) {
      errors = true
      errorArray.push("'Password' and 'Verify Password' fields don't match!")
    }
    if (errors) {
      $('#register_error').removeClass('invisible')
      $('#register_error').html(errorArray.join('<br />'))
    } else {
      const newUser = {
        username: $('#create-username')
          .val()
          .trim(),
        password: $('#create-password')
          .val()
          .trim(),
        email: $('#create-email')
          .val()
          .trim()
      }

      $.ajax('/api/account/register', {
        type: 'POST',
        data: newUser
      }).then(res => {
        if (res === 'success') {
          $(location).attr('href', '/login')
        } else {
          $('#register_error').removeClass('invisible')
          $('#register_error').text('Sorry, that username is already taken!')
        }
      })
    }
  })
})
