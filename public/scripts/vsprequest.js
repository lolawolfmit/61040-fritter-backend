/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */
function makeVSPRequest(fields) {
  fetch('/api/vsprequest', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function acceptVSPRequest(fields) {
  fetch('/api/vsprequest', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function revokeVSPStatus(fields) {
  fetch('/api/vsprequest/vspstatus', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteVSPRequest(fields) {
  fetch('/api/vsprequest', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getAllVSPRequests() {
  fetch('/api/vsprequest')
    .then(showResponse)
    .catch(showResponse);
}