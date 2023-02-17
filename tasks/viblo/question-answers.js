import axios from 'axios'
import User from '../../models/users.js'
import Question from '../../models/questions.js'
import Answer from '../../models/answers.js'
import Comments from '../../models/comments.js'
import { sleep, log } from '../../utils.js'
import {
  Platforms,
  avatarUrlPrefix,
  vibloApiUrlPrefix
} from '../../constants/index.js'

const commentTypes = {
  answer: 1
}
const devblogTeam = 'devblogTeam'
const vibloTeam = 'VibloTeam'

export default async () => {
  let limit = 50
  let page = 1
  let totalPost = 100
  while (totalPost >= 50) {
    const viblo_url = `${vibloApiUrlPrefix}/questions?feed=newest&page=${page}&limit=${limit}`
    console.log(viblo_url)
    await log({ page: page+'', fileName: 'q-a' })
    const questionIds = (await fecthQuestionIds(viblo_url)) || []

    await saveQuestions(questionIds)

    // totalPost = questionIds.length
    totalPost = 1
    page = page + 1
  }
}

async function fecthQuestionIds(url) {
  const { data } = await axios.get(url).catch(() => {
    console.log('error url: ', url)
  })

  return data.data.map(({ hash_id }) => hash_id)
}

async function saveQuestions(questionids) {
  for (let index = 0; index < questionids.length; index++) {
    // for (let index = 0; index < 49; index++) {

    const questionId = questionids[index]
    await fecthQuestion(questionId)
    await sleep(2000)
  }
}

async function fecthQuestion(questionId) {
  const questionUrl = `${vibloApiUrlPrefix}/questions/${questionId}`
  const { data } = await axios.get(questionUrl).catch(() => {
    console.log('error url: ', questionUrl)
  })

  const { question = {}, answers = {} } = data

  await Promise.allSettled([
    insertQuestion(question.data),
    insertUser(question.data.user)
  ])

  if (answers.data.length) {
    return Promise.allSettled(answers.data.map(answer => saveAnswer(answer)))
  }
}

function insertQuestion(question) {
  const questionInfo = {
    _id: `${Platforms.viblo}.${question.hash_id}`,
    seo: question.seo,
    title: question.title,
    slug: question.hash_id,
    alias: question.title_slug,
    user: question.user.data.username,
    url: question.canonical_url,
    contents: question.contents,
    sloved: question.sloved,
    points: question.points,
    rated_value: question.rated_value,
    views_count: question.views_count,
    answers_count: question.answers_count,
    tags: question.tags,
    created_at: question.created_at,
    updated_at: question.updated_at
  }

  return Question.create(questionInfo)
}

async function saveAnswer(answer) {
  const { comments } = answer
  const answerId = `${Platforms.viblo}.${answer.hash_id}`

  await Promise.allSettled([
    insertAsnwer({ ...answer, answerId }),
    insertUser(answer.user.data)
  ])

  if (comments.data.length) {
    return Promise.allSettled([
      ...comments.data.map(comment => saveComment({ ...comment, answerId }))
    ])
  }
}

function insertAsnwer(answer) {
  const user =
    vibloTeam === answer.user.data.username
      ? devblogTeam
      : answer.user.data.username

  const answerInfo = {
    _id: answer.answerId,
    user,
    accepted: answer.accepted,
    deleted_at: answer.deleted_at,
    contents: answer.contents,
    points: answer.points,
    question_id: answer.question_id,
    rated_value: answer.rated_value,
    created_at: answer.created_at,
    updated_at: answer.updated_at
  }

  return Answer.create(answerInfo)
}

function saveComment(comment) {
  return Promise.allSettled([
    insertComment(comment),
    insertUser(comment.user.data)
  ])
}

function insertUser(user) {
  const username = vibloTeam === user.username ? devblogTeam : user.username

  const userInfo = {
    _id: username,
    name: user.name,
    username: username,
    avatar: `${avatarUrlPrefix}/${user.avatar}`,
    followers_count: user.followers_count,
    posts_count: user.posts_count,
    reputation: user.reputation
  }

  return User.create(userInfo)
}

function insertComment(comment) {
  const user =
    vibloTeam === comment.user.data.username
      ? devblogTeam
      : comment.user.data.username
  const commentInfo = {
    _id: `${Platforms.viblo}.${comment.hash_id}`,
    user,
    points: comment.points,
    rated_value: comment.rated_value,
    comment_type: commentTypes.answer,
    related_id: comment.answerId,
    contents: comment.contents,
    contents_short: comment.contents_short,
    created_at: comment.created_at,
    updated_at: comment.updated_at
  }

  return Comments.create(commentInfo)
}
