
function createNode(element, className) {
  var el = document.createElement(element);
  if (className) {
    el.className = className;
  }
  return el;
}

function append(parent, el) {
  return parent.appendChild(el);
}

function createProductInfoDiv(auction) {
    let container = createNode('div', 'product-info-div'),
        nameLabel = createNode('p', 'product-name-label'),
        currentBidLabel = createNode('p', 'current-bid-label'),
        timeRemainingLabel = createNode('p', 'time-remaining-label');

    nameLabel.innerHTML = auction.product_name;
    currentBidLabel.innerHTML = getCurrentBidTextFromAuction(auction);
    timeRemainingLabel.innerHTML = getTimeRemainingFromAuction(auction);

    append(container, nameLabel);
    append(container, currentBidLabel);
    append(container, timeRemainingLabel);
    return container;
}

function createViewAuctionButton(auction) {
  var button = createNode('button', 'view-auction-button');
  button.innerHTML = "View auction";
  button.onclick = function() { window.location.href = "singleView.html?id=" + auction.auction_id }
  return button;
}

function createListElements() {
  var auction_list = document.getElementById('auction-list');
  fetch("https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/getAuction")
    .then(function(res) { return res.json() })
    .then(function(data) {
      let auctions = data.auctions
      return auctions.map(auction => {
        let listElement = createNode('div', 'auction-list-element'),
            categoryImage = createNode('img', 'category-img'),
            productInfoDiv = createProductInfoDiv(auction),
            viewAuctionButton = createViewAuctionButton(auction);

        categoryImage.src = auction.image;
        append(listElement, categoryImage);
        append(listElement, productInfoDiv);
        append(listElement, viewAuctionButton);
        append(auction_list, listElement);
      })
    })
    .catch(function(err) {
      alert("Something crashed...");
      console.log(err)
    });
}

function makeUser(name,address,email,phone) {

    const url = "https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/createSeller";

    let data = {
        seller_name:name,
        seller_email:email,
        seller_address:address,
        seller_phone:phone
    };

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url,fetchData)
        .then(res => {
            console.log(res);
        });

    alert('User added');

}

function makeAuction(name, price, description, category, duration){

    const url = "https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/createAuction";

    let data = {
        seller_id:'d2235910-ced4-11e7-882f-75e15f1a770d',
        product_name:name,
        min_price:price,
        description:description,
        category:category,
        image:'https://i.imgur.com/p3fWg61.png',
        duration_days:duration

    };

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    };

    fetch(url,fetchData)
        .then(res => {
            console.log(res)
        });

    alert('Auction added');

}