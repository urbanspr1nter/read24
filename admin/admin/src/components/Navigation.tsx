import React from 'react';
import { Link } from 'react-router-dom';

import './Navigation.css';
import { Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function Navigation() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light">
                <Link to="/" className="navbar-brand">read24</Link>
                <div className="navbar-nav">
                    <Dropdown>
                        <Dropdown.Toggle>
                            Books
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <LinkContainer to="/book/add">
                                <Dropdown.Item>Add</Dropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/book/list">
                                <Dropdown.Item>List</Dropdown.Item>
                            </LinkContainer>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>
                            Classrooms
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <LinkContainer to="/classroom/add">
                                <Dropdown.Item>Add</Dropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/classroom/list">
                                <Dropdown.Item>List</Dropdown.Item>
                            </LinkContainer>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>
                            Users
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <LinkContainer to="/user/add">
                                <Dropdown.Item>Add</Dropdown.Item>
                            </LinkContainer>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>
                            Teachers
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <LinkContainer to="/teacher/add">
                                <Dropdown.Item>Add</Dropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/teacher/list">
                                <Dropdown.Item>List</Dropdown.Item>
                            </LinkContainer>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </nav>
        </div>
    );
}
