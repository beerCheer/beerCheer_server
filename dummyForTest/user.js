/*
1,2,3번 유저는 preference, rate 모두
4번 유저는 preference 안하고 rate만
5번 유저는 preference만 하고 rate 안함 
*/

const users = [
  {
    nickname: "test1",
    email: "test1@test.com",
    isPreferenceOrRateChecked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nickname: "test2",
    email: "test2@test.com",
    isPreferenceOrRateChecked: true,
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nickname: "test3",
    email: "test3@test.com",
    isPreferenceOrRateChecked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nickname: "test4",
    email: "test4@test.com",
    isPreferenceOrRateChecked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nickname: "test5",
    email: "test5@test.com",
    isPreferenceOrRateChecked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = users;
