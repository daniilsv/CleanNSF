const fp = require("fastify-plugin");
module.exports = fp(async function (f, opts) {
  f.decorate("rules", {
    userInGroupCan: function (userId, groupId, rule) { return userInGroupCan(f, userId, groupId, rule); },
  });
});

const userInGroupCan = async function (f, userId, groupId, rule) {
  const redisKey = `u${userId}/g${groupId}/can${rule}`;
  if (await f.redis.exists(redisKey)) {
    f.redis.expire(redisKey, 60 * 60);
    return await f.redis.get(redisKey);
  }
  const Group = f.db.Group;
  const User = f.db.User;
  let userGroups = await Group.findOne({
    where: { id: groupId },
    include: [
      {
        model: Group, as: 'ancestors',
        include: {
          model: User,
          where: { id: userId },
          through: {
            where: { rules: { [f.db.Op.contains]: [rule] } }
          },
        }
      },
      { model: User }
    ],
  });
  let ret = false
  if (userGroups.ancestors.length != 0)
    ret = true;
  else
    for (let _ of userGroups.Users)
      if (_.GroupUser.rules.includes(rule)) {
        ret = true;
        break;
      }

  f.redis.set(redisKey, ret);
  f.redis.expire(redisKey, 60 * 60);
  return ret;
};
