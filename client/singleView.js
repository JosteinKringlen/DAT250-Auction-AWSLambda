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

function setBidError(err) {
  document.getElementById("bid-error-label").innerHTML = err;
}

const submitBid = () => {
  let auction_id = new URL(window.location.href).searchParams.get("id");
  let bidSize = document.getElementById('bid-input').value;
  if (isNaN(bidSize)) {
    setBidError("Please enter a numeric value")
    return;
  }

  const url = "https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/postBid/" + auction_id;

  let data = {
    new_bid: bidSize,
    bidder_id: "d2235910-ced4-11e7-882f-75e15f1a770d" //hardcoded for testing
  }

  let fetchData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(url, fetchData)
    .then(res => {
      console.log(res.status);
      if (res.status == 200) {
        document.getElementById('main-bid-label').innerHTML = "$" + bidSize
        document.getElementById('side-bid-label').innerHTML = "$" + bidSize
        document.getElementById('main-bid-header').innerHTML = "Current bid";
        document.getElementById('side-bid-header').innerHTML = "Current bid";
        document.getElementById('bid-input').value = ""
        alert("Bid placed!")
        setBidError("");
      } else {
        setBidError("Not a valid bid, bid to small");
        alert("Not a valid bid")
      }
    })
    .catch(err => {
      console.log(err)
    });
}

function createInfoContainer(auction) {
  let infoContainer = createNode('div', 'info-container')
      nameLabel = createNode('p', 'name-label'),
      categoryLabel = createNode('p', 'category-label'),
      descriptionLabel = createNode('p', 'description-label'),
      currentBidLabel = createNode('p', 'bidding-label'),
      currentBidHeader = createNode('p', 'current-bid-header'),
      descriptionHeader = createNode('p', 'description-header');

  nameLabel.innerHTML = auction.product_name;
  categoryLabel.innerHTML = auction.category;
  descriptionHeader.innerHTML = "Description";
  descriptionLabel.innerHTML = auction.description;
  currentBidHeader.innerHTML = auction.bids.length !== 0 ? "Current bid" : "Minimum bid";
  currentBidLabel.innerHTML = "$" + getCurrentBidFromAuction(auction);
  currentBidLabel.id = "side-bid-label";
  currentBidHeader.id = "side-bid-header";

  append(infoContainer, nameLabel);
  append(infoContainer, categoryLabel);
  append(infoContainer, descriptionHeader);
  append(infoContainer, descriptionLabel);
  append(infoContainer, currentBidHeader);
  append(infoContainer, currentBidLabel);
  return infoContainer;
}

function createBiddingContainer(auction) {
  let container = createNode('div', 'bidding-container');
  let bidHeader = createNode('p', 'current-bid-header'),
      currentBidLabel = createNode('p', 'bidding-label'),
      timeRemainingLabel = createNode('p', 'time-remaining-label'),
      biddingForm = createNode('div', 'bidding-form'),
      bidErrorLabel = createNode('div', 'bid-error-label'),
      bidInputField = createNode('input', 'bid-input-field'),
      bidButton = createNode('button', 'bid-button');

  bidHeader.innerHTML = auction.bids.length !== 0 ? "Current bid" : "Minimum bid";
  currentBidLabel.innerHTML = "$" + getCurrentBidFromAuction(auction);
  currentBidLabel.id = "main-bid-label";
  bidHeader.id = "main-bid-header";
  timeRemainingLabel.innerHTML = getTimeRemainingFromAuction(auction);
  bidInputField.type = 'number';
  bidInputField.id = 'bid-input';
  bidErrorLabel.id = 'bid-error-label';
  bidButton.innerHTML = 'Place bid';
  bidButton.onclick = submitBid;

  append(biddingForm, bidErrorLabel);
  append(biddingForm, bidInputField);
  append(biddingForm, bidButton);
  append(container, bidHeader);
  append(container, currentBidLabel);
  append(container, timeRemainingLabel);
  append(container, biddingForm);
  return container;
}

function setSingleAuction() {
  let auction_id = new URL(window.location.href).searchParams.get("id");
  var mainContainer = document.getElementById('outer-info-container');
  var biddingContainer = document.getElementById('bidding-info-container');
  var loadingDiv = document.getElementById('loading-div');

  fetch("https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/getSingleAuction/" + auction_id)
    .then(function(res) { return res.json() })
    .then(function(data) {
        loadingDiv.hidden = true;
        let auction = data;
        let categoryImage = createNode('img', 'category-image'),
            infoContainer = createInfoContainer(auction),
            innerBiddingContainer = createBiddingContainer(auction);

        categoryImage.src = auction.image;

        append(mainContainer, categoryImage);
        append(mainContainer, infoContainer);
        append(biddingContainer, innerBiddingContainer);

        fetchAndDisplaySeller(auction.seller_id);
    })
    .catch(function(err) {
      alert("Something crashed...")
      console.log(err)
    });
}

function fetchAndDisplaySeller(seller_id) {
  var sellerContainer = document.getElementById('seller-info-container');
  fetch("https://q0jzfqkffi.execute-api.eu-west-2.amazonaws.com/dev/getSingleSeller/" + seller_id)
  .then(function(res) { return res.json() })
  .then(function(data) {
    let seller = data;
    let sellerImage = createNode('img', 'seller-image'),
        sellerNameLabel = createNode('p', 'seller-name-label'),
        sellerPhoneLabel = createNode('p', 'seller-phone-label'),
        sellerEmailLabel = createNode('p', 'seller-email-label');

    sellerImage.src = "resources/user-icon.ico";
    sellerNameLabel.innerHTML = seller.seller_name;
    sellerEmailLabel.innerHTML = seller.seller_email;
    sellerPhoneLabel.innerHTML = seller.seller_phone;

    append(sellerContainer, sellerImage);
    append(sellerContainer, sellerNameLabel);
    append(sellerContainer, sellerPhoneLabel);
    append(sellerContainer, sellerEmailLabel);
  })
  .catch(function(err) {
    alert("Something crashed...")
    console.log(err)
  });
}
