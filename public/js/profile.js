let USER_ID = sessionStorage['USER_ID'];
if (!USER_ID) window.location.href = 'sign-in.html';

$(document).ready(async function () {

  const db = new Repository(database);
  const user = await db.getUserById(USER_ID);
  const image = `images/${user.species}.png`;  

  $('.owner-name').val(user.ownerName);
  $('.email').val(user.email).prop('disabled', true);
  $('.pet-image').attr('src', image);
  $('.pet-name').val(user.petName);
  $('.pet-bday').val(user.birthday);
  $('.pet-species').val(user.species);
  $('#logout').on('click', logout); 

  $('#save').on('click', function() {
    const newUser = {
      petName: $('.pet-name').val(),
      birthday: $('.pet-bday').val(),
      ownerName: $('.owner-name').val(),
      species: $('.pet-species').val()
    }
    db.updateUser(USER_ID, newUser);
    window.location.reload();
  });

  $('#cancel').on('click', function() {
    window.location.reload();
  })
});

