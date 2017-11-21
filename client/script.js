
function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

function createListElements() {
  var auction_list = document.getElementById('auction-list');
  fetch("https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/getAuction")
    .then(function(res) { return res.json() })
    .then(function(data) {
      let auctions = data.auctions
      return auctions.map(auction => {
        let listElement = createNode('li'),
            nameLabel = createNode('p');
        nameLabel.innerHTML = auction.product_name;
        append(listElement, nameLabel);
        append(auction_list, listElement);
      })
    })
    .catch(function(err) {
      alert("Something crashed...")
      console.log(err)
    });
}
