import React from 'react';
import { Table, Pagination } from 'react-bootstrap';

class IcoCalendar extends React.Component {
	constructor() {
		super();
		this.state = {
			icos: [],
			page: 1,
			resultsPerPage: 25,
			totalPages: 1,
			totalResults: 1
		};
	}

	componentDidMount() {
		this.fetchResults();
	}

	fetchResults() {
		let fetchUrl = 'https://cryptohub.herokuapp.com/api/v1/icos?';
		fetchUrl += ('results_per_page=' + this.state.resultsPerPage.toString());
		fetchUrl += ('&page=' + this.state.page.toString());
		
		fetch(fetchUrl)
		.then((response) => response.json())
		.then((responseJson) => {
			let metadata = responseJson.metadata;
			let resultsPerPage = parseInt(metadata.results_per_page, 10);
			let totalResults = parseInt(metadata.number_of_results, 10);
			let totalPages = Math.ceil(totalResults/resultsPerPage);

			this.setState({
				icos: responseJson.data,
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

	render() {
		const icoItems = this.state.icos.map((ico, i) =>
			<tr key={i}>
				<td><img src={ico.image_url} alt={ico.company_name} className="table-icon" /></td>
				<td>{ico.company_name}</td>
				<td>{ico.company_description}</td> 
				<td>{ico.starts_at}</td>
				<td>{ico.ends_at}</td>
			</tr>
			);

		return(
			<div className="ico-calendar">
				<Pagination className="pagination" prev next first last ellipsis boundaryLinks items={this.state.totalPages} maxButtons={5} activePage={this.state.page} onSelect={this.handleSelect.bind(this)} />
				<Table striped hover>
					<thead>
						<tr>
							<th></th>
							<th>Company Name</th> 
							<th>Description</th>
							<th>Starts</th>
							<th>Ends</th>
						</tr>
					</thead>
					<tbody>
						{icoItems}
					</tbody>
				</Table>
			</div>
			)
	}
}

export default IcoCalendar;
