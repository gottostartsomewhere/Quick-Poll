$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pollId = urlParams.get('pollId');
    $('#poll-id').text(pollId);

    let polls = JSON.parse(localStorage.getItem('polls')) || {};
    let poll = polls[pollId];

    if (!poll) {
        $('#message').text('Poll not found!');
        return;
    }

    let pollOptionsHtml = '';
    for (let option of poll.options) {
        pollOptionsHtml += `<input type="radio" name="option" value="${option}"> ${option}<br>`;
    }
    $('#poll-options').html(pollOptionsHtml);


    if (document.cookie.split(';').some((item) => item.trim().startsWith(`voted_${pollId}=`))) {
        $('#message').text('You have already voted in this poll.');
        $('#vote-form').hide();
    }

    $('#vote-form').submit(function(event) {
        event.preventDefault();
        let selectedOption = $('input[name="option"]:checked').val();

        if (selectedOption) {
            poll.votes[selectedOption] = poll.votes[selectedOption] ? poll.votes[selectedOption] + 1 : 1; 
            localStorage.setItem('polls', JSON.stringify(polls)); 
            document.cookie = `voted_${pollId}=true; path=/;`; 
            $('#message').text('Vote counted successfully!');
            updateChart(poll.votes); 
            $('#vote-form').hide(); 
        } else {
            $('#message').text('Please select an option to vote.');
        }
    });

    function updateChart(votes) {
        console.log('Updating chart with votes:', votes); 

        var ctx = document.getElementById('resultsChart').getContext('2d');
        var labels = Object.keys(votes);
        var data = Object.values(votes);

       
        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Votes',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var label = context.label || '';
                                if (context.raw !== null) {
                                    label += ': ' + context.raw;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

   
    if (poll) {
        updateChart(poll.votes);
    }
});
