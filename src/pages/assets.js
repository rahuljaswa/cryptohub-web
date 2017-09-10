import React from 'react';

import { Table, Pagination } from 'react-bootstrap';

var NumberFormat = require('react-number-format');


class Assets extends React.Component {
	constructor() {
		super();
		this.state = {
			assets: [],
			page: 1,
			resultsPerPage: 25,
			totalPages: 1,
			totalResults: 1,
			order: 'latest_market_cap_usd',
			order_ascending: false
		};
	}

	componentDidMount() {
		this.fetchResults();
	}

	fetchResults() {
		let fetchUrl = 'https://cryptohub.herokuapp.com/api/v1/assets?';
		fetchUrl += ('results_per_page=' + this.state.resultsPerPage.toString());
		fetchUrl += ('&page=' + this.state.page.toString());
		fetchUrl += ('&order=' + this.state.order);
		fetchUrl += ('&order_ascending=' + this.state.order_ascending);
		
		fetch(fetchUrl)
		.then((response) => response.json())
		.then((responseJson) => {
			let metadata = responseJson.metadata;
			let resultsPerPage = parseInt(metadata.results_per_page, 10);
			let totalResults = parseInt(metadata.number_of_results, 10);
			let totalPages = Math.ceil(totalResults/resultsPerPage);
			
			this.setState({
				assets: responseJson.data,
				page: metadata.page,
				resultsPerPage: resultsPerPage,
				totalPages: totalPages,
				totalResults: totalResults
			});
			return responseJson;
		})
		.catch((error) => {
			console.error(error);
		});
	}

	handleSelect(eventKey) {
		this.setState({
			page: eventKey
		}, 
		() => (
			this.fetchResults()
		));
	}

	orderBy(order) {
		let order_ascending = this.state.order_ascending;
		if (this.state.order === order) {
			order_ascending = !order_ascending;
		} else {
			order_ascending = false;
		}

		this.setState({
			order: order,
			order_ascending: order_ascending
		}, 
		() => (
			this.fetchResults()
		));
	}

	render() {
		const assetItems = this.state.assets.map((asset, i) =>
			<tr key={i}>
				<td className="center-aligned"><img src={asset.image_url} alt={asset.asset_name} className="table-icon" /></td>
				<td className="left-aligned">{asset.asset_name}</td>
				<td className="center-aligned">{asset.ticker}</td> 
				<td className="center-aligned">
					<NumberFormat 
					value={asset.latest_price_usd} 
					displayType={'text'} 
					thousandSeparator={true} 
					prefix={'$'}
					decimalPrecision={2} />
				</td>
				<td className="center-aligned">
					<NumberFormat 
						value={asset.latest_trailing_twenty_four_hours_volume}
						displayType={'text'} 
						thousandSeparator={true} 
						prefix={'$'}
						decimalPrecision={0} />
				</td>
				<td className="center-aligned">
					<NumberFormat 
						value={asset.latest_market_cap_usd}
						displayType={'text'} 
						thousandSeparator={true} 
						prefix={'$'}
						decimalPrecision={0} />
				</td>
				<td className="center-aligned">
					<NumberFormat 
						value={asset.latest_available_supply}
						displayType={'text'} 
						thousandSeparator={true} 
						prefix={'$'}
						decimalPrecision={0} />
				</td>
				<td className="center-aligned">
					<NumberFormat 
						value={asset.latest_total_supply}
						displayType={'text'} 
						thousandSeparator={true} 
						prefix={'$'}
						decimalPrecision={0} />
				</td>
				<td className="left-aligned">{asset.latest_update_datetime}</td>
			</tr>
			);

		return(
			<div className="assets">
				<Pagination className="pagination" prev next first last ellipsis boundaryLinks items={this.state.totalPages} maxButtons={3} activePage={this.state.page} onSelect={this.handleSelect.bind(this)} />
				<Table striped hover>
					<thead>
						<tr>
							<th className="center-aligned"></th>
							<th className="left-aligned"><a href="#" onClick={this.orderBy.bind(this, 'asset_name')}>Asset</a></th>
							<th className="center-aligned"><a href="#" onClick={this.orderBy.bind(this, 'ticker')}>Ticker</a></th> 
							<th className="center-aligned"><a href="#" onClick={this.orderBy.bind(this, 'latest_price_usd')}>Price</a></th>
							<th className="center-aligned"><a href="#" onClick={this.orderBy.bind(this, 'latest_trailing_twenty_four_hours_volume')}>24 Hour Volume</a></th>
							<th className="center-aligned"><a href="#" onClick={this.orderBy.bind(this, 'latest_market_cap_usd')}>Market Cap</a></th>
							<th className="center-aligned"><a href="#" onClick={this.orderBy.bind(this, 'latest_available_supply')}>Available Supply</a></th>
							<th className="center-aligned"><a href="#" onClick={this.orderBy.bind(this, 'latest_total_supply')}>Total Supply</a></th>
							<th className="left-aligned">Last Updated</th>
						</tr>
					</thead>
					<tbody>
						{assetItems}
					</tbody>
				</Table>
			</div>
			)
	}
}

export default Assets;
