$(document).ready(function() {
    $('#create-poll-form').submit(function(event) {
        event.preventDefault();
        let pollId = $('#poll-id').val();
        let options = $('#options').val().split(',').map(option => option.trim());
        let polls = JSON.parse(localStorage.getItem('polls')) || {};
        
        if (pollId in polls) {
            $('#create-message').text('Poll Name is taken / already exists!');
        } else {
            polls[pollId] = { options: options, votes: options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}) };
            localStorage.setItem('polls', JSON.stringify(polls));
            $('#create-message').text('Poll created successfully!');
        }
    });

    $('#view-poll-form').submit(function(event) {
        event.preventDefault();
        let pollId = $('#view-poll-id').val();
        window.location.href = `results.html?pollId=${pollId}`;
    });
});
