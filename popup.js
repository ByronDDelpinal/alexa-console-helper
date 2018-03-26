$('.deadify').click(function() {
    chrome.runtime.sendMessage({ undo: true })
  })

var devOnlyButton = document.getElementById('s#how-only-dev');

devOnlyButton.addEventListener('click', function(event) {
  chrome.runtime.sendMessage({ undo: true })
});