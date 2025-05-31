import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentsGET from "./pages/students/StudentsGET";
import StudentGET from "./pages/students/StudentGET";
import StudentsPOST from "./pages/students/StudentsPOST";
import StudentPUT from "./pages/students/StudentPUT";
import TeachersGET from "./pages/teachers/TeachersGET";
import TeacherGET from "./pages/teachers/TeacherGET";
import TeachersPOST from "./pages/teachers/TeachersPOST";
import TeacherPUT from "./pages/teachers/TeacherPUT";
import AdminsGET from "./pages/administrators/AdminsGET";
import AdminGET from "./pages/administrators/AdminGET";
import AdminsPOST from "./pages/administrators/AdminsPost";
import AdminPUT from "./pages/administrators/AdminPUT";
import GroupsGET from "./pages/groups/GroupsGET";
import GroupGET from "./pages/groups/GroupGET";
import GroupPUT from "./pages/groups/GroupPUT";
import GroupsPOST from "./pages/groups/GroupsPOST";
import GroupCreatorsGET from "./pages/groups/GroupCreatorsGET";
import GroupDELETE from "./pages/groups/GroupDelete";
import MembersGET from "./pages/members/MembersGET";
import MembersPOST from "./pages/members/MembersPOST";
import MembersUserGET from "./pages/members/MembersUserGET";
import MemberPUT from "./pages/members/MemberPUT";
import MembersGroupGET from "./pages/members/MembersGroupGET";
import GrpChatsGET from "./pages/groupChats/GrpChatsGET";
import GrpChatsPOST from "./pages/groupChats/GrpChatsPOST";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ul>
              <li>
                <p>Students</p>
                <ul>
                  <li>
                    <a
                      href="/students/studentsGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Students
                    </a>
                  </li>
                  <li>
                    <a
                      href="/students/studentsPOST"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      POST - Students
                    </a>
                  </li>
                  <li>
                    <a
                      href="/students/studentGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Student
                    </a>
                  </li>
                  <li>
                    <a
                      href="/students/studentPUT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PUT - Student
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <p>Teachers</p>
                <ul>
                  <li>
                    <a
                      href="/teachers/teachersGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Teachers
                    </a>
                  </li>
                  <li>
                    <a
                      href="/teachers/teacherGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Teacher
                    </a>
                  </li>
                  <li>
                    <a
                      href="/teachers/teachersPOST"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      POST - Teachers
                    </a>
                  </li>
                  <li>
                    <a
                      href="/teachers/teachersPUT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PUT - Teachers
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <p>Administrators</p>
                <ul>
                  <li>
                    <a
                      href="/admins/adminsGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Administrators
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admins/adminGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Administrator
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admins/adminsPOST"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      POST - Administrators
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admins/adminPUT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PUT - Administrator
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <p>Groups</p>
                <ul>
                  <li>
                    <a
                      href="/groups/groupsGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Groups
                    </a>
                  </li>
                  <li>
                    <a
                      href="/groups/groupGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Group
                    </a>
                  </li>
                  <li>
                    <a
                      href="/groups/groupCreatorsGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Groups by Creators
                    </a>
                  </li>
                  <li>
                    <a
                      href="/groups/groupPUT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PUT - Group
                    </a>
                  </li>
                  <li>
                    <a
                      href="/groups/groupsPOST"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      POST - Groups
                    </a>
                  </li>
                  <li>
                    <a
                      href="/groups/groupDELETE"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DELETE - Group
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <p>Members</p>
                <ul>
                  <li>
                    <a
                      href="/members/membersGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Members
                    </a>
                  </li>
                  <li>
                    <a
                      href="/members/membersUserGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Memberships by User
                    </a>
                  </li>
                  <li>
                    <a
                      href="/members/membersGroupGET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Memberships by Group
                    </a>
                  </li>
                  <li>
                    <a
                      href="/members/membersPOST"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      POST - Members
                    </a>
                  </li>
                  <li>
                    <a
                      href="/members/memberPUT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PUT - Members
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <p>Group Chats</p>
                <ul>
                  <li>
                    <a
                      href="/grp-chats/GET"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET - Group Chats
                    </a>
                  </li>
                  <li>
                    <a
                      href="/grp-chats/POST"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      POST - Group Chats
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          }
        />
        <Route path="students/studentsGET" element={<StudentsGET />} />
        <Route path="students/studentsPOST" element={<StudentsPOST />} />
        <Route path="students/studentGET" element={<StudentGET />} />
        <Route path="students/studentPUT" element={<StudentPUT />} />
        <Route path="teachers/teachersGET" element={<TeachersGET />} />
        <Route path="teachers/teacherGET" element={<TeacherGET />} />
        <Route path="teachers/teachersPOST" element={<TeachersPOST />} />
        <Route path="teachers/teachersPUT" element={<TeacherPUT />} />
        <Route path="admins/adminsGET" element={<AdminsGET />} />
        <Route path="admins/adminGET" element={<AdminGET />} />
        <Route path="admins/adminsPost" element={<AdminsPOST />} />
        <Route path="admins/adminPUT" element={<AdminPUT />} />
        <Route path="groups/groupsGET" element={<GroupsGET />} />
        <Route path="groups/groupGET" element={<GroupGET />} />
        <Route path="groups/groupPUT" element={<GroupPUT />} />
        <Route path="groups/groupsPOST" element={<GroupsPOST />} />
        <Route path="groups/groupCreatorsGET" element={<GroupCreatorsGET />} />
        <Route path="groups/groupDELETE" element={<GroupDELETE />} />
        <Route path="members/membersGET" element={<MembersGET />} />
        <Route path="members/membersPOST" element={<MembersPOST />} />
        <Route path="members/membersUserGET" element={<MembersUserGET />} />
        <Route path="members/memberPUT" element={<MemberPUT />} />
        <Route path="members/membersGroupGET" element={<MembersGroupGET />} />
        <Route path="grp-chats/GET" element={<GrpChatsGET />} />
        <Route path="grp-chats/POST" element={<GrpChatsPOST />} />
      </Routes>
    </Router>
  );
}

export default App;
