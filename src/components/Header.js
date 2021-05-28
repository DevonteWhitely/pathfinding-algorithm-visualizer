import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component {
    render() {

        return (
            <>
            <div className="grid-display">
                <div className="grid-item">
                    <p className={`node-isStartNode`}></p>
                </div>

                <div className="grid-item">
                    <p>Start Node</p>
                </div>

                <div className="grid-item">
                    <p className={`node-isEndNode`}></p>
                </div>

                <div className="grid-item">
                    <p>End Node</p>
                </div>

                <div className="grid-item">
                    <p className={`node-isWall`}></p>
                </div>

                <div className="grid-item">
                    <p>Wall Node</p>
                </div>

                <div className="grid-item">
                    <p className={`node-isPathNode`}></p>
                </div>

                <div className="grid-item">
                    <p>Path Node</p>
                </div>

                <div className="grid-item">
                    <p className={`node-isUnvisited`}></p>
                </div>

                <div className="grid-item">
                    <p>Unvisited Node</p>
                </div>
            </div>
            <p className="message">*Click on grid to add walls*</p>
            </>
        )
    }
}
