class FriendsList {
  friends = []

  addFriend(name) {
    this.friends.push(name)
    this.announceFriendship(name)
  }

  announceFriendship(name) {
    console.log(`${name} is now a friend!`)
  }

  removeFriend(name) {
    const index = this.friends.indexOf(name)

    if (index === -1) {
      throw new Error('Friend not found')
    }

    this.friends.splice(index, 1)
  }
}

describe('FriendsList', () => {
  let friendsList

  beforeEach(() => {
    friendsList = new FriendsList()
  })

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0)
  })

  it('adds one friend to friends list', () => {
    friendsList.addFriend('HelloFriend')

    expect(friendsList.friends.length).toEqual(1)
  })

  it('announces friendship', () => {
    friendsList.announceFriendship = jest.fn()
    expect(friendsList.announceFriendship).not.toHaveBeenCalled()

    friendsList.announceFriendship('HelloFriend')

    expect(friendsList.announceFriendship).toHaveBeenCalled()
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('HelloFriend')
  })

  describe('remove friend from list', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('HelloFriend')
      expect(friendsList.friends[0]).toEqual('HelloFriend')
      friendsList.removeFriend('HelloFriend')
      expect(friendsList.friends[0]).toBeUndefined()
    })

    it('throws an error as friend does not exist', () => {
      expect(() => friendsList.removeFriend('HelloFriend')).toThrow(
        new Error('Friend not found'),
      )
    })
  })
})
