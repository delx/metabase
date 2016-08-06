import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

function Title() {
    return (
        <section className="PageHeader clearfix">
            <Link to="/admin/permissions/groups" className="Button Button--primary float-right">Add someone to this group</Link>
            <h2 className="PageTitle">
                Marketing
            </h2>
        </section>
    );
}

function MembersRow({member}) {
    return (
        <tr>
            <td>{member.name}</td>
            <td>{member.email}</td>
        </tr>
    );
}

const MembersList = ({members}) => {
    console.log('members:', members); // NOCOMMIT
    return (
        <table className="ContentTable">
            <thead>
                <tr>
                    <th>Members</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {members && members.map((member, index) =>
                    <MembersRow key={index} member={member} />
                 )}
            </tbody>
        </table>
    );
}


const GroupDetail = ({ params }) => {
    const members = [
        {name: "Cynthia Williams", email: "thamilton@topicblan.edu"},
        {name: "Cynthia Williams", email: "thamilton@topicblan.edu"},
        {name: "Cynthia Williams", email: "thamilton@topicblan.edu"}
    ];

    return (
        <div>
            <Title />
            <MembersList members={members} />
        </div>
    );
}


export default GroupDetail;
