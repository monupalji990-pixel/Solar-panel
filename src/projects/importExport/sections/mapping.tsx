import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";

class CSVMapping extends Component<any, any> {
  // this is mapping file for the import/Export
  state = {
    pieces: [],
    shuffled: [],
    solved: [],
    headers: [],
    constHeader: [],
  };

  componentDidMount() {
    this.setState({ constHeader: this.props.constHeaderArray });
    this.getCSVHeaders();
  }

  getCSVHeaders() {
    const { fileData } = this.props;
    const csvFile = fileData;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const content = fileReader.result;
      const allTextLines = (content as string).split(/\r\n|\n/);
      const headers = allTextLines[0].split(",");
      this.setState({ headers });

      const { constHeader } = this.state;
      const pieces = headers.map((_, i) => ({
        headerName: _,
        order: i,
        board: "shuffled",
      }));

      this.setState({
        pieces,
        shuffled: this.shufflePieces(pieces),
        solved: [...Array(constHeader.length)],
      });
    };
    fileReader.readAsText(csvFile);
  }

  handleDrop(e, index, targetName) {
    const { pieces } = this.state;
    let target = this.state[targetName];
    if (target[index]) return;

    const pieceOrder = e.dataTransfer.getData("text");
    const pieceData = pieces.find((p) => p && p.order === +pieceOrder);
    const origin = this.state[pieceData.board];

    if (targetName === pieceData.board) target = origin;
    origin[origin.indexOf(pieceData)] = undefined;
    target[index] = pieceData;
    pieceData.board = targetName;

    this.setState({ [pieceData.board]: origin, [targetName]: target });
  }

  handleDragStart(e, order) {
    const dt = e.dataTransfer;
    dt.setData("text/plain", order);
    dt.effectAllowed = "move";
  }

  checkSolvedCount() {
    const { solved } = this.state;
    const d = solved.filter((s) => s && s !== undefined);
    return d.length;
  }

  shufflePieces(pieces) {
    return [...pieces];
  }

  renderPieceContainer(piece, index, boardName) {
    const { constHeader } = this.state;
    return (
      <React.Fragment>
        <Grid item className="dragFieldStyle">
          <h4>{constHeader[index]} : </h4>
          <li
            key={index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => this.handleDrop(e, index, boardName)}
          >
            {piece && (
              <Chip
                draggable
                onDragStart={(e) => this.handleDragStart(e, piece.order)}
                label={piece.headerName}
                variant="outlined"
              />
            )}
          </li>
        </Grid>
      </React.Fragment>
    );
  }

  renderPieceContainer2(piece, index, boardName) {
    return (
      <React.Fragment>
        <li
          key={index}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => this.handleDrop(e, index, boardName)}
        >
          {piece && (
            <Chip
              draggable
              onDragStart={(e) => this.handleDragStart(e, piece.order)}
              label={piece.headerName}
              variant="outlined"
            />
          )}
        </li>
      </React.Fragment>
    );
  }

  convertMapDataToJSON() {
    const { solved, constHeader } = this.state;
    const { fileData, importMappingData } = this.props;

    const mappingArray = {};
    for (let x = 0; x < constHeader.length; x++) {
      if (solved[x] && solved[x].headerName)
        mappingArray[constHeader[x]] = solved[x].headerName;
    }

    const csvFile = fileData;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const content = fileReader.result;
      const allTextLines = (content as any).split(/\r\n|\n/);
      const headers = allTextLines[0].split(",");
      const lines = [];

      // creating csv to JsonCSV
      for (let i = 1; i < allTextLines.length; i++) {
        let tempLine = allTextLines[i].replaceAll(/("[^",]+),([^"]+")/g, (x) => { return x.replaceAll(',', ' ') })
        //  tempLine =  allTextLines[i].replaceAll(/("[^",]+),([^"]+")/g,(x)=> { return x.replace(',',' ') })

        const data = tempLine.split(",");
        if (data.length == headers.length) {
          const o = {};
          for (let j = 0; j < headers.length; j++) {
            o[headers[j]] = data[j];
          }
          lines.push(o);
        }
      }
      console.log('------line----')
      console.log(lines.length)

      let lastObject = [];
      for (let z = 0; z < lines.length; z++) {
        const zo = {};
        const singleLine = lines[z];
        for (let zs = 0; zs < constHeader.length; zs++) {
          if (singleLine[mappingArray[constHeader[zs]]] && singleLine[mappingArray[constHeader[zs]]].includes('"')) {
            zo[constHeader[zs]] = singleLine[mappingArray[constHeader[zs]]].replaceAll('"', '');

          } else {
            zo[constHeader[zs]] = singleLine[mappingArray[constHeader[zs]]];
          }
          if (constHeader[zs] === 'SITENAME' && (mappingArray['SITENAME'] === undefined || singleLine[mappingArray['SITENAME']] === undefined)) {
            if (singleLine[mappingArray['BUSINESSNAME']] && singleLine[mappingArray['BUSINESSNAME']].includes('"')) {
              zo[constHeader[zs]] = singleLine[mappingArray['BUSINESSNAME']].replaceAll('"', '');

            } else
              zo[constHeader[zs]] = singleLine[mappingArray['BUSINESSNAME']];
          } else if (constHeader[zs] === 'SITEADDRESS' && (mappingArray['SITEADDRESS'] === undefined || singleLine[mappingArray['SITEADDRESS']] === undefined)) {
            if (singleLine[mappingArray['ADDRESSLINE1']] && singleLine[mappingArray['ADDRESSLINE1']].includes('"')) {
              zo[constHeader[zs]] = singleLine[mappingArray['ADDRESSLINE1']].replaceAll('"', '');

            } else
              zo[constHeader[zs]] = singleLine[mappingArray['ADDRESSLINE1']] !== undefined ? singleLine[mappingArray['ADDRESSLINE1']] : singleLine[mappingArray['ADDRESSLINE2']];
          } else if (constHeader[zs] === 'SITETOWN' && (mappingArray['SITETOWN'] === undefined || singleLine[mappingArray['SITETOWN']] === undefined)) {
            if (singleLine[mappingArray['TOWN']] && singleLine[mappingArray['TOWN']].includes('"')) {
              zo[constHeader[zs]] = singleLine[mappingArray['TOWN']].replaceAll('"', '');
            } else
              zo[constHeader[zs]] = singleLine[mappingArray['TOWN']];
          } else if (constHeader[zs] === 'SITECOUNTY' && (mappingArray['SITECOUNTY'] === undefined || singleLine[mappingArray['SITECOUNTY']] === undefined)) {
            if (singleLine[mappingArray['COUNTY']] && singleLine[mappingArray['COUNTY']].includes('"')) {
              zo[constHeader[zs]] = singleLine[mappingArray['COUNTY']].replaceAll('"', '');
            } else
              zo[constHeader[zs]] = singleLine[mappingArray['COUNTY']];
          } else if (constHeader[zs] === 'SITEPOSTCODE' && (mappingArray['SITEPOSTCODE'] === undefined || singleLine[mappingArray['SITEPOSTCODE']] === undefined)) {
            if (singleLine[mappingArray['POSTCODE']] && singleLine[mappingArray['POSTCODE']].includes('"')) {
              zo[constHeader[zs]] = singleLine[mappingArray['POSTCODE']].replaceAll('"', '');
            } else
              zo[constHeader[zs]] = singleLine[mappingArray['POSTCODE']];
          }

        }
        try {
          zo['service'] = {
            eco: {
              subservice: {
                solar: {

                }
              }
            }
          }
          zo['leadNotes'] = []

          if (lines[z]['Roof direction']) {
            zo['service'].eco.subservice.solar['roofOrientation'] = lines[z]['Roof direction']
          }
          if (lines[z]['Property Type']) {
            zo['service'].eco.subservice.solar['propertyType'] = lines[z]['Property Type']
          }
          if (lines[z]['Roof style']) {
            zo['service'].eco.subservice.solar['roofStyle'] = lines[z]['Roof style']
          }
          if (lines[z]['Roof material']) {
            zo['service'].eco.subservice.solar['roofMaterial'] = lines[z]['Roof material']
          }
          if (lines[z]['Shading']) {
            zo['service'].eco.subservice.solar['shading'] = lines[z]['Shading']
          }
          if (lines[z]['Owner']) {
            zo['service'].eco.subservice.solar['ownership'] = lines[z]['Owner']
          }

          if (lines[z]['Timescale']) {
            zo['leadNotes'].push('Timescale: ' + lines[z]['Timescale'])
          }
          if (lines[z]['Description']) {
            zo['leadNotes'].push('Description: ' + lines[z]['Description'])
          }
          if (lines[z]['Add notes']) {
            zo['leadNotes'].push('notes: ' + lines[z]['Add notes'])
          }

          if (zo['MOBILENUMBER']?.length > 0 && zo['MOBILENUMBER'].includes('-')) {
            zo['MOBILENUMBER'] = zo['MOBILENUMBER'].replaceAll('-', '')
          }
          if (zo['MOBILENUMBER']?.length === 10) {
            zo['MOBILENUMBER'] = '0' + zo['MOBILENUMBER'];
          }
          zo['topLineMPAN'] = '';
          zo['topLineMPAN'] = zo['PC']

          if (zo['PC']?.length == 1) {
            zo['PC'] = '0' + zo['PC']
            zo['topLineMPAN'] = zo['PC'];
          } else if (zo['PC']?.length == 2) {
            zo['topLineMPAN'] = zo['PC'];
          }

          if (zo['MTC']?.length == 1) {
            zo['MTC'] = '00' + zo['MTC']
            zo['topLineMPAN'] = zo['topLineMPAN'] + zo['MTC']
          } else if (zo['MTC']?.length == 2) {
            zo['MTC'] = '0' + zo['MTC']
            zo['topLineMPAN'] = zo['topLineMPAN'] + zo['MTC']
          } else if (zo['MTC']?.length == 3) {
            zo['topLineMPAN'] = zo['topLineMPAN'] + zo['MTC']
          }

          if (zo['LLF']?.length == 1) {
            zo['LLF'] = '00' + zo['LLF']
            zo['topLineMPAN'] = zo['topLineMPAN'] + zo['LLF']
          } else if (zo['LLF']?.length == 2) {
            zo['LLF'] = '0' + zo['LLF']
            zo['topLineMPAN'] = zo['topLineMPAN'] + zo['LLF']
          } else if (zo['LLF']?.length == 3) {
            zo['topLineMPAN'] = zo['topLineMPAN'] + zo['LLF']
          }

        } catch (e) {
          console.log(e);
        }
        lastObject.push(zo);
      }
      // console.log(lastObject)
      // timescale,description,notes  in notes
      // fields = propertyType,roofOrientation,roofStyle, roofMaterial, shading,ownership

      // owner to ownershiptype


      if (this.props.importType === 'import-consumer')
        importMappingData(lastObject, "consumer");
      else if (this.props.importType === 'import-company')
        // console.log('----')
        // lastObject.length = 5
        importMappingData(lastObject, "company");

    };
    fileReader.readAsText(csvFile);
  }

  render() {
    const { shuffled, solved, constHeader } = this.state;
    return (
      <Grid
        container
        spacing={3}
        component={Paper}
        className="DragMappingStyle"
      >
        <Grid item md={3} xs={12} className="LeftDragableItems">
          <ul>
            {shuffled.map((piece, i) =>
              this.renderPieceContainer2(piece, i, "shuffled")
            )}
          </ul>
        </Grid>
        <Grid item md={9} xs={12} className="RightDragableItems">
          <ol>
            {solved.map((piece, i) =>
              this.renderPieceContainer(piece, i, "solved")
            )}
          </ol>
        </Grid>
        <Grid item sm={6} xs={12} container spacing={2}>
          <Grid item>
            <Button
              onClick={() => this.convertMapDataToJSON()}
              variant="contained"
              size="medium"
              color="primary"
            >
              Submit
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={() => this.props.setIsOpenMap(false)}
              variant="outlined"
              size="medium"
              color="primary"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default CSVMapping;
